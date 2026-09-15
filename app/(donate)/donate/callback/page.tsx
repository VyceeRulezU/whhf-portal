import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { withDb } from "@/lib/db/client";
import { donations } from "@/lib/db/schema";
import { providers } from "@/lib/payments/router";
import styles from "./callback.module.css";

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
  searchParams: Promise<{ reference?: string; tx_ref?: string }>;
}) {
  const params = await searchParams;
  const reference = params.reference ?? params.tx_ref;

  if (!reference) {
    redirect("/donate");
  }

  const donation = await withDb((db) =>
    db.query.donations.findFirst({ where: eq(donations.providerReference, reference) })
  );

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
    <div className="section">
      <div className="container container--narrow stack">
        <h1>Still confirming your donation…</h1>
        <p className={styles.message}>
          This can take a moment. If this page doesn&rsquo;t update shortly,
          check your email for a receipt or contact us. Your payment may
          still have gone through even if this page hasn&rsquo;t caught up
          yet.
        </p>
      </div>
    </div>
  );
}
