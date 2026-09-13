import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Goes through the `pg` driver + Prisma's driver-adapter API (schema.prisma
 * `previewFeatures = ["driverAdapters"]`) rather than Prisma's own built-in
 * connection handling. Two reasons:
 *
 * 1. This is what makes the app deployable to Cloudflare Workers at all —
 *    Workers can't hold a raw TCP Postgres connection the way a normal Node
 *    process can, so production traffic there goes through a Cloudflare
 *    Hyperdrive binding instead. See README.md ("Deploying to Cloudflare
 *    Workers") for what's still needed beyond this file: Hyperdrive
 *    bindings are only reachable per-request (via `getCloudflareContext()`
 *    from `@opennextjs/cloudflare`), not through `process.env` — this
 *    module-level singleton works as-is for normal Node hosting (`next
 *    dev`/`next start`) and local `wrangler dev`, but the Workers
 *    production path needs that binding wired in before going live there.
 * 2. It works identically today, on normal Node hosting, off the same
 *    `DATABASE_URL` — nothing changes for local dev or a non-Cloudflare
 *    deploy target.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
