import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

export async function POST() {
  destroySession();
  return NextResponse.json({ data: { ok: true } }, { status: 200 });
}
