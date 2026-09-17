import type { Metadata } from "next";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHero } from "@/components/marketing/PageHero";
import { FaqSection } from "@/components/marketing/FaqSection";
import { DonateCta } from "@/components/marketing/DonateCta";
import { getPageContent } from "@/lib/content/getPageContent";
import styles from "./programmes.module.css";

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "Direct financial grants toward chemotherapy and treatment costs for indigent cancer patients, distributed in partnership with National Hospital, Abuja."
};

interface ProgramArea {
  heading: string;
  body: string;
}

interface Step {
  number: string;
  heading: string;
  body: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export default async function ProgrammesPage() {
  const content = await getPageContent("programmes");
  const areas = content["programmes.areas"] as ProgramArea[];
  const steps = content["programmes.steps"] as Step[];
  const faqItems = content["programmes.faq.items"] as FaqItem[];

  return (
    <>
      <PageHero
        eyebrow={content["programmes.hero.eyebrow"] as string}
        title={content["programmes.hero.title"] as string}
        lede={content["programmes.hero.lede"] as string}
      />

      <section className="section">
        <div className="container">
          <Card className={styles.flagshipCard}>
            <div className={styles.flagshipImageWrap}>
              <Image
                src={content["programmes.flagship.image"] as string}
                alt="Placeholder: cancer patient support programme photography pending"
                fill
                sizes="(max-width: 900px) 100vw, 480px"
                className={styles.flagshipImage}
              />
            </div>
            <div className={styles.flagshipBody}>
              <Badge featured>{content["programmes.flagship.badge"] as string}</Badge>
              <h2 className={styles.flagshipHeading}>{content["programmes.flagship.heading"] as string}</h2>
              <p className={styles.flagshipText}>{content["programmes.flagship.body1"] as string}</p>
              <p className={styles.flagshipText}>{content["programmes.flagship.body2"] as string}</p>
            </div>
          </Card>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.stepsHeader}>
            <p className="eyebrow-label">/ Programme Areas /</p>
            <h2>{content["programmes.areas.heading"] as string}</h2>
          </div>
          <div className={styles.areasGrid}>
            {areas.map((area) => (
              <Card key={area.heading} className={styles.areaCard}>
                <h3 className={styles.areaHeading}>{area.heading}</h3>
                <p className={styles.areaBody}>{area.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.stepsHeader}>
            <p className="eyebrow-label">/ How It Works /</p>
            <h2>{content["programmes.steps.heading"] as string}</h2>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map((step) => (
              <Card key={step.number} className={styles.stepCard}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepHeading}>{step.heading}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.approachGrid}>
            <div className={styles.approachImageWrap}>
              <Image
                src={content["programmes.approach.image"] as string}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 520px"
                className={styles.approachImage}
              />
            </div>
            <div className="stack">
              <p className="eyebrow-label">/ Looking Ahead /</p>
              <h2>{content["programmes.approach.heading"] as string}</h2>
              <p className={styles.approachText}>{content["programmes.approach.body1"] as string}</p>
              <p className={styles.approachText}>{content["programmes.approach.body2"] as string}</p>
            </div>
          </div>
        </div>
      </section>

      <FaqSection
        heading={content["programmes.faq.heading"] as string}
        intro={content["programmes.faq.intro"] as string}
        sideHeading={
          <>
            Verified need. <em>Direct support.</em>
          </>
        }
        sideBody={content["programmes.faq.sideBody"] as string}
        items={faqItems}
      />

      <DonateCta image={content["programmes.donateCta.image"] as string} />
    </>
  );
}
