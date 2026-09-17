import type { Metadata } from "next";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";
import { DonateCta } from "@/components/marketing/DonateCta";
import { CoreValuesTimeline } from "@/components/marketing/CoreValuesTimeline";
import { sitePhotos } from "@/lib/content/sitePhotos";
import { siteVideos } from "@/lib/content/siteVideos";
import { getPageContent } from "@/lib/content/getPageContent";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The William & Helen Heritage Foundation was established in memory of Rev. (Mrs) Helen Titilayo Okoye, continuing the generosity she was known for."
};

// Icons are decorative and stay code-defined, zipped against the
// family-editable "about.values" list by index — see /admin/content/about
// and lib/content/registry.ts. An item added beyond these 4 renders
// without a custom icon rather than breaking.
const VALUE_ICONS = [
  <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 21c-2.2 0-4-1.8-4-4 0-2.5 4-8 4-8s4 5.5 4 8c0 2.2-1.8 4-4 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 4v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 20s-7-4.5-9.5-9C1 8 2 4.5 5.5 4.5c2 0 3.5 1.2 4 2.3.5-1.1 2-2.3 4-2.3 3.5 0 4.5 3.5 3 6.5C19 15.5 12 20 12 20z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>,
  <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="16" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M3 19c0-3 2.5-5 5-5s5 2 5 5M11 19c0-2.5 2-4.5 5-4.5s5 2 5 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
];

interface ValueCard {
  title: string;
  body: string;
}

export default async function AboutPage() {
  const content = await getPageContent("about");
  const values = content["about.values"] as ValueCard[];
  const coreValueSentences = [
    content["about.coreValues.godliness"],
    content["about.coreValues.integrity"],
    content["about.coreValues.veracity"],
    content["about.coreValues.excellence"],
    content["about.coreValues.humility"],
    content["about.coreValues.earnestness"],
    content["about.coreValues.love"],
    content["about.coreValues.peace"]
  ] as string[];

  return (
    <>
      <PageHero eyebrow={content["about.hero.eyebrow"] as string} title={content["about.hero.title"] as string} />
      <section className="section">
        <div className={`container ${styles.grid}`}>
          <div className={styles.imageWrap}>
            <Image
              src={content["about.intro.image"] as string}
              alt="Placeholder: WHHF programme photography pending"
              fill
              sizes="(max-width: 900px) 100vw, 520px"
              className={styles.image}
            />
          </div>
          <div className="stack">
            <p>{content["about.intro.paragraph1"] as string}</p>
            <p>{content["about.intro.paragraph2"] as string}</p>
            <p>{content["about.intro.paragraph3"] as string}</p>
            {/*
              Content on this page is pending further confirmation from
              the WHHF board. Do not add or remove memorial content
              without sign-off — see docs/content-style-guide.md.
            */}
          </div>
        </div>
      </section>

      {/* Purpose/Vision statements, from WHHF's own printed materials. */}
      <section className="section section--tight">
        <div className="container">
          <div className={styles.purposeVisionGrid}>
            <Card>
              <p className="eyebrow-label">/ Purpose /</p>
              <h2 className={styles.purposeVisionHeading}>{content["about.purpose.heading"] as string}</h2>
              <p className={styles.purposeVisionBody}>{content["about.purpose.body"] as string}</p>
            </Card>
            <Card>
              <p className="eyebrow-label">/ Vision /</p>
              <h2 className={styles.purposeVisionHeading}>{content["about.vision.heading"] as string}</h2>
              <p className={styles.purposeVisionBody}>{content["about.vision.body"] as string}</p>
            </Card>
          </div>
        </div>
      </section>

      <CoreValuesTimeline image={content["about.coreValues.image"] as string} sentences={coreValueSentences} />

      <section className="section">
        <div className="container stack">
          <div className={styles.valuesHeader}>
            <p className="eyebrow-label">/ What We Stand For /</p>
            <h2>{content["about.values.heading"] as string}</h2>
          </div>
          <div className={styles.valuesImageWrap}>
            <Image src={content["about.values.image"] as string} alt="" fill sizes="100vw" className={styles.valuesImage} />
          </div>
          <div className={styles.valuesGrid}>
            {values.map((value, index) => (
              <Card key={value.title} className={styles.valueCard}>
                {VALUE_ICONS[index] && (
                  <span className={styles.valueIcon} aria-hidden="true">
                    {VALUE_ICONS[index]}
                  </span>
                )}
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueBody}>{value.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--wide">
          <video
            className={styles.storyVideo}
            src={siteVideos.ourStory}
            autoPlay
            muted
            loop
            playsInline
            controls
          />
        </div>
      </section>

      {/* storyMain is a tall portrait cropped into a very wide, short
          banner — center/top both clip the faces badly; this percentage
          was picked by eye against the source photo (couple dancing,
          faces sit roughly a fifth of the way down the frame). */}
      <DonateCta image={sitePhotos.storyMain} imagePosition="center 18%" />
    </>
  );
}
