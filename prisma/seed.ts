/**
 * Seeds the minimum data the app needs to run locally:
 * - a default "general-fund" Cause (referenced by DonationForm.tsx)
 * - one bootstrap AdminUser, ONLY if SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD
 *   are set in the environment — never a hardcoded default password. See
 *   security.md.
 *
 * Run with: npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  await prisma.cause.upsert({
    where: { slug: "general-fund" },
    update: {},
    create: {
      slug: "general-fund",
      name: "General Fund",
      description: "Supports WHHF's programmes, starting with indigent cancer patient care.",
      isDefault: true
    }
  });

  await prisma.cause.upsert({
    where: { slug: "cancer-patient-support" },
    update: {},
    create: {
      slug: "cancer-patient-support",
      name: "Indigent Cancer Patient Support",
      description: "Direct grants toward chemotherapy and treatment costs for patients who cannot afford care.",
      isDefault: false
    }
  });

  const seedEmail = process.env.SEED_ADMIN_EMAIL;
  const seedPassword = process.env.SEED_ADMIN_PASSWORD;

  if (seedEmail && seedPassword) {
    const passwordHash = await hashPassword(seedPassword);
    await prisma.adminUser.upsert({
      where: { email: seedEmail.toLowerCase() },
      update: {},
      create: { email: seedEmail.toLowerCase(), passwordHash, role: "admin" }
    });
    console.log(`Seeded admin user: ${seedEmail}`);
  } else {
    console.log("SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD not set — skipping admin user seed.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
