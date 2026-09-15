import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { withDb } from "@/lib/db/client";
import { webhookEvents, donations } from "@/lib/db/schema";
import { providers } from "@/lib/payments/router";
import { sendDonationReceiptForReference } from "@/lib/email/sendDonationReceipt";

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
    await withDb((db) =>
      db.insert(webhookEvents).values({
        provider: "flutterwave",
        eventId: event.rawEventId,
        rawPayload: JSON.parse(rawBody)
      })
    );
  } catch {
    // Duplicate delivery — safe to continue.
  }

  const verified = await providers.flutterwave.verify(event.reference);

  await withDb((db) =>
    db
      .update(donations)
      .set({
        status: verified.status === "success" ? "succeeded" : verified.status === "failed" ? "failed" : "processing"
      })
      .where(eq(donations.providerReference, event.reference))
  );

  if (verified.status === "success") {
    await sendDonationReceiptForReference(event.reference);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
