import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { withDb } from "@/lib/db/client";
import { contactMessages } from "@/lib/db/schema";

const updateStatusSchema = z.object({
  status: z.enum(["unread", "read", "replied"])
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }

  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = updateStatusSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "invalid_input", message: parsed.error.message } },
      { status: 400 }
    );
  }

  try {
    const [message] = await withDb((db) =>
      db.update(contactMessages).set({ status: parsed.data.status }).where(eq(contactMessages.id, id)).returning()
    );
    return NextResponse.json({ data: message });
  } catch (err) {
    console.error("[api/admin/messages] unexpected error", err);
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
    await withDb((db) => db.delete(contactMessages).where(eq(contactMessages.id, id)));
    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    console.error("[api/admin/messages] unexpected error", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
