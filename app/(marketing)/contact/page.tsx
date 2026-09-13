import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";
import styles from "./contact.module.css";

const CONTACT_ROWS = [
  { label: "Office address", value: "Pending confirmation from WHHF" },
  { label: "Phone", value: "Pending confirmation from WHHF" },
  { label: "Email", value: "Pending confirmation from WHHF" }
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
          <Card className={styles.card}>
            {/* TODO: confirm real office address, phone, and email with WHHF board. */}
            <dl className={styles.list}>
              {CONTACT_ROWS.map((row) => (
                <div key={row.label} className={styles.row}>
                  <dt className={styles.label}>{row.label}</dt>
                  <dd className={styles.value}>{row.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </section>
    </>
  );
}
