import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";
import { ContactForm } from "@/components/contact";
import { getPageContent } from "@/lib/content/getPageContent";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the William & Helen Heritage Foundation about partnerships, volunteering, or general enquiries."
};

// See /admin/content/contact and lib/content/registry.ts — "contact.rows"
// is also read by components/marketing/SiteFooter directly, so the two
// never drift out of sync. Dynamic rendering is set once at
// app/(marketing)/layout.tsx, not per page.

interface ContactRow {
  label: string;
  value: string;
}

export default async function ContactPage() {
  const content = await getPageContent("contact");
  const rows = content["contact.rows"] as ContactRow[];

  return (
    <>
      <PageHero
        eyebrow={content["contact.hero.eyebrow"] as string}
        title={content["contact.hero.title"] as string}
        lede={content["contact.hero.lede"] as string}
      />
      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            <Card className={styles.card}>
              <dl className={styles.list}>
                {rows.map((row) => (
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
