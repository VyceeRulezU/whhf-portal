import {
  pgTable as pgTableDefault,
  pgEnum as pgEnumDefault,
  pgSchema,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Drizzle schema — replaces prisma/schema.prisma (see lib/db/client.ts for
 * why: Prisma's engine-less client can't run on Cloudflare Workers, see
 * README.md "Deploying to Cloudflare Workers"). Originally written to
 * match tables Prisma's migration had already created; that's now
 * formalized as drizzle/migrations/0000_aberrant_toad.sql, generated from
 * this file and marked as already-applied against the live database (see
 * .agent/skills/db-migration-runner/skill.md). Any schema change from here
 * on goes through drizzle-kit generate + migrate, not hand-run SQL.
 *
 * Every table/enum is schema-qualified via DB_SCHEMA (defaults to
 * "public") rather than the bare pgTable/pgEnum — this is what lets the
 * staging Worker share the exact same Hyperdrive config + database as
 * production while staying fully isolated, via a separate Postgres
 * schema ("staging") holding its own copy of every table. Cloudflare
 * Hyperdrive's connection string doesn't support the `?options=-c
 * search_path=...` query param (confirmed: it rejects the connection
 * with "invalid database credentials"), so schema selection happens
 * here at the query level instead of in the connection string. See
 * docs/production-readiness.md Phase 4.
 */

const genId = () => crypto.randomUUID();

// Drizzle disallows pgSchema("public") outright (it wants the bare
// pgTable/pgEnum for that case) — so only build a PgSchema wrapper for a
// genuinely non-default schema, and fall through to the normal
// unqualified functions otherwise. Keeps production's generated SQL
// byte-identical to before this file supported multiple schemas.
const schemaName = process.env.DB_SCHEMA || "public";
const dbSchema = schemaName === "public" ? null : pgSchema(schemaName);
// The two branches' generic TName differs (a literal schema name vs.
// undefined for the default pgTable/pgEnum), which TypeScript won't
// unify into one callable signature — safe to assert, since both
// accept identical call shapes at runtime regardless of TName.
// .bind(dbSchema) matters — dbSchema.table/.enum are class methods that
// read `this.schemaName` internally; extracting them as plain function
// references (without binding) loses that `this` and throws at call time.
const pgTable = (dbSchema ? dbSchema.table.bind(dbSchema) : pgTableDefault) as typeof pgTableDefault;
const pgEnum = (dbSchema ? dbSchema.enum.bind(dbSchema) : pgEnumDefault) as typeof pgEnumDefault;

export const donationStatusEnum = pgEnum("DonationStatus", [
  "pending",
  "processing",
  "succeeded",
  "failed",
  "refunded"
]);

export const paymentProviderNameEnum = pgEnum("PaymentProviderName", [
  "paystack",
  "flutterwave",
  "korapay",
  "manual"
]);

export const contactMessageStatusEnum = pgEnum("ContactMessageStatus", ["unread", "read", "replied"]);

export const donors = pgTable(
  "Donor",
  {
    id: text("id").primaryKey().$defaultFn(genId),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    address: text("address"),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow()
  },
  (table) => [index("Donor_email_idx").on(table.email)]
);

export const donorsRelations = relations(donors, ({ many }) => ({
  donations: many(donations)
}));

export const causes = pgTable("Cause", {
  id: text("id").primaryKey().$defaultFn(genId),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  isDefault: boolean("isDefault").notNull().default(false),
  createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow()
});

export const causesRelations = relations(causes, ({ many }) => ({
  donations: many(donations)
}));

export const donations = pgTable(
  "Donation",
  {
    id: text("id").primaryKey().$defaultFn(genId),
    donorId: text("donorId")
      .notNull()
      .references(() => donors.id),
    causeId: text("causeId")
      .notNull()
      .references(() => causes.id),
    amount: integer("amount").notNull(), // smallest currency unit — never a float
    currency: text("currency").notNull(), // ISO 4217, e.g. "NGN", "USD"
    status: donationStatusEnum("status").notNull().default("pending"),
    provider: paymentProviderNameEnum("provider").notNull(),
    providerReference: text("providerReference").notNull().unique(),
    isRecurring: boolean("isRecurring").notNull().default(false),
    recurringParentId: text("recurringParentId"),
    isManualEntry: boolean("isManualEntry").notNull().default(false),
    message: text("message"),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { precision: 3 })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  (table) => [
    index("Donation_status_idx").on(table.status),
    index("Donation_provider_idx").on(table.provider),
    index("Donation_createdAt_idx").on(table.createdAt)
  ]
);

export const donationsRelations = relations(donations, ({ one }) => ({
  donor: one(donors, { fields: [donations.donorId], references: [donors.id] }),
  cause: one(causes, { fields: [donations.causeId], references: [causes.id] })
}));

export const webhookEvents = pgTable(
  "WebhookEvent",
  {
    id: text("id").primaryKey().$defaultFn(genId),
    provider: paymentProviderNameEnum("provider").notNull(),
    eventId: text("eventId").notNull(),
    rawPayload: jsonb("rawPayload").notNull(),
    receivedAt: timestamp("receivedAt", { precision: 3 }).notNull().defaultNow()
  },
  (table) => [uniqueIndex("WebhookEvent_provider_eventId_key").on(table.provider, table.eventId)]
);

export const adminUsers = pgTable("AdminUser", {
  id: text("id").primaryKey().$defaultFn(genId),
  email: text("email").notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  role: text("role").notNull().default("admin"), // "admin" | "content_editor" — see security.md
  createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow()
});

// Submissions from the public /contact form. Each one is also emailed to
// CONTACT_INBOX_EMAIL via Resend (see lib/email/resend.ts) — this table is
// the durable record + what the admin dashboard reads, since an inbox
// alone isn't shared/searchable/auditable the way a DB table is.
export const contactMessages = pgTable(
  "ContactMessage",
  {
    id: text("id").primaryKey().$defaultFn(genId),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    subject: text("subject"),
    message: text("message").notNull(),
    status: contactMessageStatusEnum("status").notNull().default("unread"),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow()
  },
  (table) => [index("ContactMessage_status_idx").on(table.status), index("ContactMessage_createdAt_idx").on(table.createdAt)]
);

// Real inbound email delivered to ANY @whheritagefoundation.org address
// (contact@, info@, hello@, etc.) — not form submissions. Populated by
// POST /api/webhooks/inbound-email, which the separate workers/email-router
// Cloudflare Worker calls after Cloudflare Email Routing hands it a raw
// message. See workers/email-router/README.md for the required Cloudflare
// dashboard setup this depends on.
export const inboundEmails = pgTable(
  "InboundEmail",
  {
    id: text("id").primaryKey().$defaultFn(genId),
    fromAddress: text("fromAddress").notNull(),
    toAddress: text("toAddress").notNull(),
    subject: text("subject"),
    textBody: text("textBody"),
    htmlBody: text("htmlBody"),
    receivedAt: timestamp("receivedAt", { precision: 3 }).notNull().defaultNow(),
    isRead: boolean("isRead").notNull().default(false)
  },
  (table) => [index("InboundEmail_toAddress_idx").on(table.toAddress), index("InboundEmail_receivedAt_idx").on(table.receivedAt)]
);

// Email sent BY an admin — either a reply to a ContactMessage/InboundEmail
// (inReplyToId points at whichever one, no FK since it's polymorphic) or a
// fresh compose. See app/api/admin/email/send/route.ts — this table is the
// durable "Outgoing" record; Resend's own dashboard isn't queryable from here.
export const sentEmails = pgTable(
  "SentEmail",
  {
    id: text("id").primaryKey().$defaultFn(genId),
    toAddress: text("toAddress").notNull(),
    fromAddress: text("fromAddress").notNull(),
    subject: text("subject").notNull(),
    body: text("body").notNull(),
    inReplyToId: text("inReplyToId"),
    // Comma-separated — display-only, never queried/filtered by address.
    ccAddresses: text("ccAddresses"),
    bccAddresses: text("bccAddresses"),
    attachmentNames: text("attachmentNames"),
    sentByAdminId: text("sentByAdminId")
      .notNull()
      .references(() => adminUsers.id),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow()
  },
  (table) => [index("SentEmail_createdAt_idx").on(table.createdAt)]
);

export const sentEmailsRelations = relations(sentEmails, ({ one }) => ({
  sentBy: one(adminUsers, { fields: [sentEmails.sentByAdminId], references: [adminUsers.id] })
}));

// Public /newsletter signups — collected from the footer form (see
// components/marketing/NewsletterForm). isActive flips to false on
// unsubscribe (app/(marketing)/newsletter/unsubscribe/page.tsx) rather
// than deleting the row, so re-subscribing the same address is a
// straightforward re-activation, not a fresh insert with a fresh id.
export const newsletterSubscribers = pgTable(
  "NewsletterSubscriber",
  {
    id: text("id").primaryKey().$defaultFn(genId),
    email: text("email").notNull().unique(),
    isActive: boolean("isActive").notNull().default(true),
    subscribedAt: timestamp("subscribedAt", { precision: 3 }).notNull().defaultNow(),
    unsubscribedAt: timestamp("unsubscribedAt", { precision: 3 })
  },
  (table) => [index("NewsletterSubscriber_isActive_idx").on(table.isActive)]
);

// One row per admin-triggered newsletter campaign — the durable send
// history the admin dashboard's Newsletter page reads back (see
// app/api/admin/newsletter/send/route.ts). recipientCount is a snapshot
// of how many subscribers actually got that run, since the subscriber
// list itself keeps changing after the fact.
export const sentNewsletters = pgTable(
  "SentNewsletter",
  {
    id: text("id").primaryKey().$defaultFn(genId),
    subject: text("subject").notNull(),
    body: text("body").notNull(),
    recipientCount: integer("recipientCount").notNull(),
    sentByAdminId: text("sentByAdminId")
      .notNull()
      .references(() => adminUsers.id),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow()
  },
  (table) => [index("SentNewsletter_createdAt_idx").on(table.createdAt)]
);

export const sentNewslettersRelations = relations(sentNewsletters, ({ one }) => ({
  sentBy: one(adminUsers, { fields: [sentNewsletters.sentByAdminId], references: [adminUsers.id] })
}));
