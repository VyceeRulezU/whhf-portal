CREATE TABLE "SiteContentField" (
	"id" text PRIMARY KEY NOT NULL,
	"fieldKey" text NOT NULL,
	"fieldType" text NOT NULL,
	"value" jsonb NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedByAdminId" text,
	CONSTRAINT "SiteContentField_fieldKey_unique" UNIQUE("fieldKey")
);
--> statement-breakpoint
ALTER TABLE "SiteContentField" ADD CONSTRAINT "SiteContentField_updatedByAdminId_AdminUser_id_fk" FOREIGN KEY ("updatedByAdminId") REFERENCES "public"."AdminUser"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "SiteContentField_fieldKey_idx" ON "SiteContentField" USING btree ("fieldKey");