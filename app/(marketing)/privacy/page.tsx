import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How the William & Helen Heritage Foundation collects, uses, and protects your information."
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy Policy" title="How we handle your information." />
      <section className="section">
        <div className="container">
          <div className={styles.doc}>
            {/* TODO: pending final review by WHHF's legal adviser (Barr.
                Patrick Abah, per public reporting) — see
                docs/compliance-nigeria-ngo.md. Do not add specific
                data-retention periods, third-party processor names, or
                regulatory claims (e.g. NDPR compliance) without sign-off. */}
            <p className={styles.notice}>
              This policy is pending final review by WHHF&rsquo;s legal
              adviser and will be updated once confirmed. In the meantime,
              here is a plain description of what the site actually does.
            </p>

            <h2>Information we collect</h2>
            <p>
              When you make a donation, we collect your full name, email
              address, and the donation amount, along with a payment
              reference from our payment provider so we can confirm and
              reconcile the transaction. We do not collect or store your
              card or bank details directly. These are handled by our
              payment providers.
            </p>

            <h2>How we use it</h2>
            <p>
              Donor information is used to process and record your
              donation, send you confirmation of your gift, and maintain
              accurate records for WHHF&rsquo;s own accountability and
              reporting. We do not sell donor information to third parties.
            </p>

            <h2>Cookies</h2>
            <p>
              The site uses only the essential cookies needed for it to
              function, such as keeping an administrator signed in. We do
              not currently use advertising or third-party tracking
              cookies.
            </p>

            <h2>Contact</h2>
            <p>
              For questions about this policy or your information, reach
              out through our{" "}
              <a href="/contact">Contact page</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
