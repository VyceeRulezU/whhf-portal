import type { Metadata } from "next";
import { DonationForm } from "@/components/donate";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";
import { getPageContent } from "@/lib/content/getPageContent";
import styles from "./donate.module.css";

export const metadata: Metadata = {
  title: "Donate",
  description: "Make a donation to the William & Helen Heritage Foundation. Every gift goes directly toward supporting indigent cancer patients."
};

interface BankRow {
  label: string;
  value: string;
}

export default async function DonatePage() {
  const content = await getPageContent("donate");
  const bankRows = content["donate.bank.rows"] as BankRow[];

  return (
    <>
      <PageHero
        eyebrow={content["donate.hero.eyebrow"] as string}
        title={content["donate.hero.title"] as string}
        lede={content["donate.hero.lede"] as string}
      />
      <div className="section">
        <div className="container container--narrow">
          <Card>
            <DonationForm />
          </Card>

          <Card className={styles.bankCard}>
            <h2 className={styles.bankHeading}>{content["donate.bank.heading"] as string}</h2>
            <p className={styles.bankNote}>{content["donate.bank.note"] as string}</p>
            <dl className={styles.bankList}>
              {bankRows.map((row) => (
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
