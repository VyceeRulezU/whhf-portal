import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import * as Sentry from "@sentry/nextjs";
import { withDb } from "@/lib/db/client";

/**
 * Pinged on a schedule by .github/workflows/supabase-keep-alive.yml —
 * Supabase's free tier pauses a project after a stretch of no database
 * activity, and this project's admin dashboard is the only thing that
 * would normally touch it. A real query here (not just an HTTP hit)
 * resets that inactivity clock. Gated by CRON_SECRET so this doesn't
 * become an open, unauthenticated way to spin up DB connections.
 */
export async function GET(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const provided = req.headers.get("x-cron-secret");
    if (provided !== expected) {
      return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
    }
  }

  try {
    await withDb((db) => db.execute(sql`select 1`));
    return NextResponse.json({ data: { ok: true, pingedAt: new Date().toISOString() } });
  } catch (err) {
    console.error("[api/cron/keep-alive] failed", err);
    Sentry.captureException(err);
    return NextResponse.json({ error: { code: "internal_error" } }, { status: 500 });
  }
}
