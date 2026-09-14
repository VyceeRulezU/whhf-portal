import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// For future schema changes only (`npx drizzle-kit generate` / `migrate`).
// The existing tables were created by Prisma's migration and this schema
// was written to match them exactly — see lib/db/schema.ts.
export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
});
