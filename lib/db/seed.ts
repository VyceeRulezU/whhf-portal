import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { causes, adminUsers } from "./schema";
import { hashPassword } from "../auth/password";

/**
 * Seeds the minimum data the app needs to run locally:
 * - two Causes (referenced by DonationForm.tsx)
 * - one bootstrap AdminUser, ONLY if SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD
 *   are set in the environment — never a hardcoded default password. See
 *   security.md.
 *
 * Run with: npm run db:seed
 */
async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    await db
      .insert(causes)
      .values({
        slug: "general-fund",
        name: "General Fund",
        description: "Supports WHHF's programmes, starting with indigent cancer patient care.",
        isDefault: true
      })
      .onConflictDoNothing({ target: causes.slug });

    await db
      .insert(causes)
      .values({
        slug: "cancer-patient-support",
        name: "Indigent Cancer Patient Support",
        description: "Direct grants toward chemotherapy and treatment costs for patients who cannot afford care.",
        isDefault: false
      })
      .onConflictDoNothing({ target: causes.slug });

    const seedEmail = process.env.SEED_ADMIN_EMAIL;
    const seedPassword = process.env.SEED_ADMIN_PASSWORD;

    if (seedEmail && seedPassword) {
      const passwordHash = await hashPassword(seedPassword);
      const email = seedEmail.toLowerCase();
      const existing = await db.query.adminUsers.findFirst({ where: eq(adminUsers.email, email) });
      if (!existing) {
        await db.insert(adminUsers).values({ email, passwordHash, role: "admin" });
      }
      console.log(`Seeded admin user: ${seedEmail}`);
    } else {
      console.log("SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD not set — skipping admin user seed.");
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
