import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import * as Sentry from "@sentry/nextjs";
import { withDb } from "@/lib/db/client";

/**
 * Public, unauthenticated health check for uptime monitoring — deliberately
 * open (no secret) since external monitors (UptimeRobot, a scheduled GitHub
 * Action, Cloudflare Health Checks) need to hit it without credentials.
 * Returns only a boolean-ish status, never anything sensitive. See
 * app/api/cron/keep-alive/route.ts for the separate, secret-gated DB
 * keep-alive ping this is NOT a replacement for.
 */
export async function GET() {
  const checkedAt = new Date().toISOString();

  try {
    await withDb((db) => db.execute(sql`select 1`));
    return NextResponse.json({ data: { status: "ok", database: "ok", checkedAt } });
  } catch (err) {
    console.error("[api/health] database check failed", err);
    Sentry.captureException(err);
    return NextResponse.json({ data: { status: "error", database: "error", checkedAt } }, { status: 503 });
  }
}
