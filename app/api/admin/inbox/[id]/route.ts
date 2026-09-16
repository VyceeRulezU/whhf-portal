import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import * as Sentry from "@sentry/nextjs";
import { getSession } from "@/lib/auth/session";
import { withDb } from "@/lib/db/client";
import { inboundEmails } from "@/lib/db/schema";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }

  const { id } = await params;

  try {
    const [email] = await withDb((db) =>
      db.update(inboundEmails).set({ isRead: true }).where(eq(inboundEmails.id, id)).returning()
    );
    return NextResponse.json({ data: email });
  } catch (err) {
    console.error("[api/admin/inbox] unexpected error", err);
    Sentry.captureException(err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }

  const { id } = await params;

  try {
    await withDb((db) => db.delete(inboundEmails).where(eq(inboundEmails.id, id)));
    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    console.error("[api/admin/inbox] unexpected error", err);
    Sentry.captureException(err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
