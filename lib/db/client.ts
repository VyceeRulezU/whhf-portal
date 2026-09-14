import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

/**
 * Replaces lib/db/prisma.ts. Prisma's engine-less client (schema
 * engineType "client") still relies on a WASM query compiler that
 * Cloudflare Workers refuses to compile at runtime
 * (`WebAssembly.Module(): Wasm code generation disallowed by embedder`)
 * — confirmed via `wrangler tail` against the real deployed Worker, and
 * not resolvable through Prisma/OpenNext configuration alone. Drizzle has
 * no engine of its own (no native binary, no WASM) — it's a pure
 * TypeScript query builder that hands SQL straight to the `pg` driver
 * below, so that whole class of problem doesn't apply.
 *
 * The `pg` driver itself still needs a real TCP connection. A module-level
 * Pool singleton (the usual Node.js pattern) does NOT work on Cloudflare
 * Workers: warm isolates get reused across many requests, so a cached
 * Pool's socket can be left over from a previous request and go stale —
 * confirmed in production as intermittent "Workers runtime canceled this
 * request because it detected that your Worker's code had hung" errors on
 * the CSV export route. Cloudflare's supported fix is Hyperdrive (see
 * wrangler.jsonc), which expects — and is optimized for — a fresh Pool
 * per request rather than a long-lived one. `withDb` below creates one,
 * runs the callback, and tears it down before returning.
 */
type Schema = typeof schema;
type Db = ReturnType<typeof drizzle<Schema>>;

async function resolveConnectionString(): Promise<string> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const hyperdrive = (env as { HYPERDRIVE?: { connectionString: string } }).HYPERDRIVE;
    if (hyperdrive?.connectionString) {
      return hyperdrive.connectionString;
    }
  } catch {
    // Not running on Cloudflare Workers (e.g. local `next dev`) — fall
    // through to DATABASE_URL below.
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return url;
}

export async function withDb<T>(fn: (db: Db) => Promise<T>): Promise<T> {
  const connectionString = await resolveConnectionString();
  const pool = new Pool({ connectionString, max: 1 });
  try {
    return await fn(drizzle(pool, { schema }));
  } finally {
    await pool.end();
  }
}
