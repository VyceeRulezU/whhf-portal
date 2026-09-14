import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }

  const { id } = await params;

  try {
    const email = await prisma.inboundEmail.update({ where: { id }, data: { isRead: true } });
    return NextResponse.json({ data: email });
  } catch (err) {
    console.error("[api/admin/inbox] unexpected error", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
