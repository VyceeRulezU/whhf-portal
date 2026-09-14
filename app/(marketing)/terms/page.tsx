import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms governing use of the William & Helen Heritage Foundation website."
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Terms of Use" title="The terms behind this site." />
      <section className="section">
        <div className="container">
          <div className={styles.doc}>
            {/* TODO: pending final review by WHHF's legal adviser (Barr.
                Patrick Abah, per public reporting) — see
                docs/compliance-nigeria-ngo.md. Do not add specific
                governing-law, dispute-resolution, or liability clauses
                without sign-off. */}
            <p className={styles.notice}>
              These terms are pending final review by WHHF&rsquo;s legal
              adviser and will be updated once confirmed.
            </p>

            <h2>Using this site</h2>
            <p>
              This website provides information about the William &amp;
              Helen Heritage Foundation (WHHF), our programmes, and a way
              to make donations. You&rsquo;re welcome to browse and use it
              for these purposes.
            </p>

            <h2>Donations</h2>
            <p>
              Donations made through this site are processed by our
              third-party payment providers. Please review the amount and
              your details before confirming a donation, as gifts are
              generally non-refundable once processed.
            </p>

            <h2>Content</h2>
            <p>
              Text, images, and branding on this site belong to WHHF or are
              used with permission, and shouldn&rsquo;t be reproduced
              without asking us first.
            </p>

            <h2>Changes</h2>
            <p>
              We may update these terms from time to time as WHHF&rsquo;s
              operations and legal review progress.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms can be sent through our{" "}
              <a href="/contact">Contact page</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
