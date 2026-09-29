ALTER TABLE "InterestSubmission" ADD COLUMN "category" text DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE "InterestSubmission" ADD COLUMN "otherDetails" text;