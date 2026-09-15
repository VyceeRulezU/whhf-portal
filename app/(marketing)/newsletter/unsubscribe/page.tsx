import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { PageHero } from "@/components/marketing/PageHero";
import { withDb } from "@/lib/db/client";
import { newsletterSubscribers } from "@/lib/db/schema";
import styles from "../../legal.module.css";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Unsubscribe from William & Helen Heritage Foundation newsletter emails."
};

interface UnsubscribePageProps {
  searchParams: Promise<{ email?: string }>;
}

/**
 * Landed on directly from the "Unsubscribe from these emails" link in
 * every newsletter email (see lib/email/templates.ts's newsletterTemplate)
 * — a one-click GET, matching how virtually every newsletter unsubscribe
 * link works, rather than requiring a signed-in session. Idempotent: an
 * already-inactive or unknown address just renders the same confirmation.
 */
export default async function NewsletterUnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const { email } = await searchParams;
  const normalized = email?.trim().toLowerCase();

  if (normalized) {
    await withDb((db) =>
      db
        .update(newsletterSubscribers)
        .set({ isActive: false, unsubscribedAt: new Date() })
        .where(eq(newsletterSubscribers.email, normalized))
    );
  }

  return (
    <>
      <PageHero eyebrow="Newsletter" title="You've been unsubscribed." />
      <section className="section">
        <div className="container">
          <div className={styles.doc}>
            <p>
              {normalized
                ? `${normalized} will no longer receive newsletter emails from William & Helen Heritage Foundation.`
                : "No email address was provided, so nothing was changed."}
            </p>
            <p>Changed your mind? You can resubscribe any time from the form in our site footer.</p>
          </div>
        </div>
      </section>
    </>
  );
}
