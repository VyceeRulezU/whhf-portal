import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer reads datasource.url from schema.prisma for CLI
// commands (migrate/db seed/etc.) — see the migration note in
// prisma/schema.prisma. Runtime queries still go through
// lib/db/prisma.ts's own PrismaClient({ adapter }) construction, not this
// file; this only wires up the CLI.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
});
