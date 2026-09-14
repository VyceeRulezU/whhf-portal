import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

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
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status: parsed.data.status }
    });
    return NextResponse.json({ data: message });
  } catch (err) {
    console.error("[api/admin/messages] unexpected error", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
