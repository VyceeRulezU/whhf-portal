import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { providers } from "@/lib/payments/router";

/**
 * See .agent/skills/flutterwave-integration/skill.md before editing. Never
 * trust the webhook body's amount/status — always re-verify server-to-server.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("verif-hash");

  const event = providers.flutterwave.parseWebhook(rawBody, signature);
  if (!event) {
    console.warn("[webhooks/flutterwave] signature verification failed");
    return NextResponse.json({ error: { code: "invalid_signature" } }, { status: 401 });
  }

  try {
    await prisma.webhookEvent.create({
      data: { provider: "flutterwave", eventId: event.rawEventId, rawPayload: JSON.parse(rawBody) }
    });
  } catch {
    // Duplicate delivery — safe to continue.
  }

  const verified = await providers.flutterwave.verify(event.reference);

  await prisma.donation.updateMany({
    where: { providerReference: event.reference },
    data: {
      status: verified.status === "success" ? "succeeded" : verified.status === "failed" ? "failed" : "processing"
    }
  });

  // TODO: send receipt email on success, outside the response path.

  return NextResponse.json({ received: true }, { status: 200 });
}
