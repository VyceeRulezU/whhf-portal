CREATE TABLE "InterestSubmission" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "InterestSubmission_createdAt_idx" ON "InterestSubmission" USING btree ("createdAt");