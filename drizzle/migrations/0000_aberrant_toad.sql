CREATE TYPE "public"."ContactMessageStatus" AS ENUM('unread', 'read', 'replied');--> statement-breakpoint
CREATE TYPE "public"."DonationStatus" AS ENUM('pending', 'processing', 'succeeded', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."PaymentProviderName" AS ENUM('paystack', 'flutterwave', 'korapay', 'manual');--> statement-breakpoint
CREATE TABLE "AdminUser" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"passwordHash" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "AdminUser_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "Cause" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "Cause_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ContactMessage" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text,
	"message" text NOT NULL,
	"status" "ContactMessageStatus" DEFAULT 'unread' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Donation" (
	"id" text PRIMARY KEY NOT NULL,
	"donorId" text NOT NULL,
	"causeId" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"status" "DonationStatus" DEFAULT 'pending' NOT NULL,
	"provider" "PaymentProviderName" NOT NULL,
	"providerReference" text NOT NULL,
	"isRecurring" boolean DEFAULT false NOT NULL,
	"recurringParentId" text,
	"isManualEntry" boolean DEFAULT false NOT NULL,
	"message" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "Donation_providerReference_unique" UNIQUE("providerReference")
);
--> statement-breakpoint
CREATE TABLE "Donor" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"address" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "InboundEmail" (
	"id" text PRIMARY KEY NOT NULL,
	"fromAddress" text NOT NULL,
	"toAddress" text NOT NULL,
	"subject" text,
	"textBody" text,
	"htmlBody" text,
	"receivedAt" timestamp (3) DEFAULT now() NOT NULL,
	"isRead" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "NewsletterSubscriber" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"subscribedAt" timestamp (3) DEFAULT now() NOT NULL,
	"unsubscribedAt" timestamp (3),
	CONSTRAINT "NewsletterSubscriber_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "SentEmail" (
	"id" text PRIMARY KEY NOT NULL,
	"toAddress" text NOT NULL,
	"fromAddress" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"inReplyToId" text,
	"ccAddresses" text,
	"bccAddresses" text,
	"attachmentNames" text,
	"sentByAdminId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SentNewsletter" (
	"id" text PRIMARY KEY NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"recipientCount" integer NOT NULL,
	"sentByAdminId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WebhookEvent" (
	"id" text PRIMARY KEY NOT NULL,
	"provider" "PaymentProviderName" NOT NULL,
	"eventId" text NOT NULL,
	"rawPayload" jsonb NOT NULL,
	"receivedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_Donor_id_fk" FOREIGN KEY ("donorId") REFERENCES "public"."Donor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_causeId_Cause_id_fk" FOREIGN KEY ("causeId") REFERENCES "public"."Cause"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SentEmail" ADD CONSTRAINT "SentEmail_sentByAdminId_AdminUser_id_fk" FOREIGN KEY ("sentByAdminId") REFERENCES "public"."AdminUser"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SentNewsletter" ADD CONSTRAINT "SentNewsletter_sentByAdminId_AdminUser_id_fk" FOREIGN KEY ("sentByAdminId") REFERENCES "public"."AdminUser"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ContactMessage_status_idx" ON "ContactMessage" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "Donation_status_idx" ON "Donation" USING btree ("status");--> statement-breakpoint
CREATE INDEX "Donation_provider_idx" ON "Donation" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "Donation_createdAt_idx" ON "Donation" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "Donor_email_idx" ON "Donor" USING btree ("email");--> statement-breakpoint
CREATE INDEX "InboundEmail_toAddress_idx" ON "InboundEmail" USING btree ("toAddress");--> statement-breakpoint
CREATE INDEX "InboundEmail_receivedAt_idx" ON "InboundEmail" USING btree ("receivedAt");--> statement-breakpoint
CREATE INDEX "NewsletterSubscriber_isActive_idx" ON "NewsletterSubscriber" USING btree ("isActive");--> statement-breakpoint
CREATE INDEX "SentEmail_createdAt_idx" ON "SentEmail" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "SentNewsletter_createdAt_idx" ON "SentNewsletter" USING btree ("createdAt");--> statement-breakpoint
CREATE UNIQUE INDEX "WebhookEvent_provider_eventId_key" ON "WebhookEvent" USING btree ("provider","eventId");