import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { withDb } from "@/lib/db/client";
import { newsletterSubscribers } from "@/lib/db/schema";

/** Admin removing a subscriber directly (not via their own unsubscribe
    link) — e.g. a bounced or mistaken address. Deletes the row outright
    rather than deactivating, since this is an admin cleanup action, not
    the subscriber's own opt-out (see the unsubscribe page for that path). */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }

  const { id } = await params;

  try {
    await withDb((db) => db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id)));
    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    console.error("[api/admin/newsletter/subscribers] unexpected error", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
