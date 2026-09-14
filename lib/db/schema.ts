import { pgTable, pgEnum, text, integer, boolean, timestamp, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Drizzle schema — replaces prisma/schema.prisma (see lib/db/client.ts for
 * why: Prisma's engine-less client can't run on Cloudflare Workers, see
 * README.md "Deploying to Cloudflare Workers"). Table/column/enum names
 * match EXACTLY what Prisma's migration already created in the real
 * database (prisma/migrations/20260914170027_init_schema/migration.sql)
 * — no new migration needed, this schema just describes the existing
 * tables. Any FUTURE schema change should go through drizzle-kit
 * (drizzle.config.ts) instead of prisma/ from here on.
 */

const genId = () => crypto.randomUUID();

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
