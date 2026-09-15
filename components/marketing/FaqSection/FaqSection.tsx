import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import type { AccordionItemData } from "@/components/ui/Accordion";
import type { ReactNode } from "react";
import styles from "./FaqSection.module.css";

interface FaqSectionProps {
  eyebrow?: string;
  heading: string;
  intro?: string;
  sideHeading: ReactNode;
  sideBody: string;
  ctaLabel?: string;
  ctaHref?: string;
  items: AccordionItemData[];
}

/** Shared FAQ block (eyebrow/heading + intro, then a sticky side pitch
    beside an Accordion) — originally the homepage's FAQ section, now
    reused across marketing pages. */
export function FaqSection({
  eyebrow = "FAQ",
  heading,
  intro,
  sideHeading,
  sideBody,
  ctaLabel = "Donate Now",
  ctaHref = "/donate",
  items
}: FaqSectionProps) {
  return (
    <section className="section">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headingGroup}>
            <p className="eyebrow-label">/ {eyebrow} /</p>
            <h2>{heading}</h2>
          </div>
          {intro && <p className={styles.intro}>{intro}</p>}
        </div>
        <div className={styles.grid}>
          <div className={styles.side}>
            <h3 className={styles.sideHeading}>{sideHeading}</h3>
            <p className={styles.sideBody}>{sideBody}</p>
            <Link href={ctaHref}>
              <Button variant="primary" showIconChip>
                {ctaLabel}
              </Button>
            </Link>
          </div>
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
