import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";
import { ContactForm } from "@/components/contact";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the William & Helen Heritage Foundation about partnerships, volunteering, or general enquiries."
};

const CONTACT_ROWS = [
  { label: "Office address", value: "3FVM+H9M, Along Nile Street, Maitama, Abuja 904101, Federal Capital Territory" },
  { label: "Phone", value: "0806 432 0084" },
  { label: "Email", value: "contact@whheritagefoundation.org" }
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch."
        lede="Reach out about partnerships, volunteering, or general enquiries."
      />
      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            <Card className={styles.card}>
              <dl className={styles.list}>
                {CONTACT_ROWS.map((row) => (
                  <div key={row.label} className={styles.row}>
                    <dt className={styles.label}>{row.label}</dt>
                    <dd className={styles.value}>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
            <Card className={styles.formCard}>
              <ContactForm />
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
