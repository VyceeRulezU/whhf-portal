import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { inboundEmailSchema } from "@/lib/validation/inboundEmail";
import { prisma } from "@/lib/db/prisma";

/**
 * Called by the separate workers/email-router Cloudflare Worker after
 * Cloudflare Email Routing hands it a raw inbound message addressed to
 * any @whheritagefoundation.org address — this is NOT the /contact form
 * (that's app/api/contact/route.ts). See workers/email-router/README.md
 * for the Cloudflare dashboard setup this depends on.
 */
export async function POST(req: NextRequest) {
  const expected = process.env.INBOUND_EMAIL_WEBHOOK_SECRET;
  if (!expected) {
    console.error("[webhooks/inbound-email] INBOUND_EMAIL_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: { code: "not_configured" } }, { status: 500 });
  }

  const provided = req.headers.get("x-webhook-secret") ?? "";
  if (!isEqual(provided, expected)) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = inboundEmailSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "invalid_input", message: parsed.error.message } },
      { status: 400 }
    );
  }

  try {
    const email = await prisma.inboundEmail.create({
      data: {
        fromAddress: parsed.data.from,
        toAddress: parsed.data.to,
        subject: parsed.data.subject,
        textBody: parsed.data.text,
        htmlBody: parsed.data.html
      }
    });
    return NextResponse.json({ data: { id: email.id } }, { status: 201 });
  } catch (err) {
    console.error("[webhooks/inbound-email] unexpected error", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}

function isEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
