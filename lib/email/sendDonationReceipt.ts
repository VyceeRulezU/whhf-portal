import { eq } from "drizzle-orm";
import { withDb } from "@/lib/db/client";
import { donations } from "@/lib/db/schema";
import { formatCurrency } from "@/lib/format/currency";
import { sendEmail } from "./resend";
import { donationReceiptTemplate } from "./templates";

/**
 * Best-effort donation receipt — called from each payment webhook's
 * success path (see app/api/webhooks/{paystack,flutterwave,korapay}/route.ts)
 * after a donation's status is confirmed "succeeded" via server-to-server
 * verification. Never throws: a failed receipt email must not break the
 * webhook response, since the donation itself already recorded
 * successfully — this is a courtesy on top, not the source of truth.
 */
export async function sendDonationReceiptForReference(reference: string): Promise<void> {
  try {
    const donation = await withDb((db) =>
      db.query.donations.findFirst({
        where: eq(donations.providerReference, reference),
        with: { donor: true, cause: true }
      })
    );

    if (!donation || donation.status !== "succeeded") return;

    await sendEmail({
      to: donation.donor.email,
      subject: "Thank you for your donation to WHHF",
      html: donationReceiptTemplate({
        donorName: donation.donor.name,
        amount: formatCurrency(donation.amount, donation.currency),
        causeName: donation.cause.name,
        reference: donation.providerReference,
        date: donation.createdAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      })
    });
  } catch (err) {
    console.error("[sendDonationReceiptForReference] failed", err);
  }
}
