import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { providers } from "@/lib/payments/router";

/**
 * The provider redirects the donor's browser here after checkout. This is
 * a convenience path for the UI only — it is NOT the source of truth for
 * marking a donation succeeded (the webhook + verify call is). We still
 * re-verify here so we never display success based on the redirect alone.
 * See architecture.md ("Data flow") and security.md ("Payment integrity").
 */
export default async function DonateCallbackPage({
  searchParams
}: {
  searchParams: { reference?: string; tx_ref?: string };
}) {
  const reference = searchParams.reference ?? searchParams.tx_ref;

  if (!reference) {
    redirect("/donate");
  }

  const donation = await prisma.donation.findUnique({ where: { providerReference: reference } });

  if (!donation) {
    redirect("/donate");
  }

  // Re-verify server-to-server rather than trusting that arriving on this
  // page means success — the webhook may not have landed yet either.
  const provider = providers[donation.provider as keyof typeof providers];
  const verified = await provider.verify(reference).catch(() => null);

  if (verified?.status === "success") {
    redirect("/donate/thank-you");
  }

  return (
    <div className="stack">
      <h1>Still confirming your donation…</h1>
      <p style={{ color: "var(--color-text-secondary)" }}>
        This can take a moment. If this page doesn&rsquo;t update shortly,
        check your email for a receipt or contact us — your payment may
        still have gone through even if this page hasn&rsquo;t caught up
        yet.
      </p>
    </div>
  );
}
