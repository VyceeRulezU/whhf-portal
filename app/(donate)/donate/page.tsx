import type { Metadata } from "next";
import { DonationForm } from "@/components/donate";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";
import styles from "./donate.module.css";

export const metadata: Metadata = {
  title: "Donate",
  description: "Make a donation to the William & Helen Heritage Foundation. Every gift goes directly toward supporting indigent cancer patients."
};

const BANK_DETAILS = [
  { label: "Account name", value: "William and Helen Heritage Foundation" },
  { label: "Account number", value: "5600513265" },
  { label: "Bank", value: "Fidelity Bank" }
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Donate"
        title="Make a donation."
        lede="Every gift goes directly toward WHHF's programmes, starting with support for indigent cancer patients."
      />
      <div className="section">
        <div className="container container--narrow">
          <Card>
            <DonationForm />
          </Card>

          <Card className={styles.bankCard}>
            <h2 className={styles.bankHeading}>Prefer a bank transfer?</h2>
            <p className={styles.bankNote}>
              While online card payments are being finalized, you can also give directly by bank transfer using the
              details below.
            </p>
            <dl className={styles.bankList}>
              {BANK_DETAILS.map((row) => (
                <div key={row.label} className={styles.bankRow}>
                  <dt className={styles.bankLabel}>{row.label}</dt>
                  <dd className={styles.bankValue}>{row.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
