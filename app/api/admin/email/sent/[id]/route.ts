import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { withDb } from "@/lib/db/client";
import { sentEmails } from "@/lib/db/schema";

/** Deletes a row from the Outgoing tab's history — the email itself was
    already delivered by Resend; this only removes WHHF's own durable
    record of having sent it (e.g. a test send or a mistake). */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }

  const { id } = await params;

  try {
    await withDb((db) => db.delete(sentEmails).where(eq(sentEmails.id, id)));
    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    console.error("[api/admin/email/sent] unexpected error", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
