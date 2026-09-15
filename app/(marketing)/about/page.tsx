import type { Metadata } from "next";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";
import { DonateCta } from "@/components/marketing/DonateCta";
import { placeholderImages } from "@/lib/content/placeholderImages";
import { sitePhotos } from "@/lib/content/sitePhotos";
import { siteVideos } from "@/lib/content/siteVideos";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The William & Helen Heritage Foundation was established in memory of Rev. (Mrs) Helen Titilayo Okoye, continuing the generosity she was known for."
};

const VALUES = [
  {
    title: "Faith-Led",
    body: "Every act of generosity is grounded in the same conviction WHHF was founded on, cheerful, practical faith in action.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 21c-2.2 0-4-1.8-4-4 0-2.5 4-8 4-8s4 5.5 4 8c0 2.2-1.8 4-4 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 4v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: "Direct to Patients",
    body: "Grants go straight toward chemotherapy and treatment costs, not overhead, not intermediaries.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 20s-7-4.5-9.5-9C1 8 2 4.5 5.5 4.5c2 0 3.5 1.2 4 2.3.5-1.1 2-2.3 4-2.3 3.5 0 4.5 3.5 3 6.5C19 15.5 12 20 12 20z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    )
  },
  {
    title: "Transparent",
    body: "Every donation is tracked and reported, so you can see exactly how your generosity is put to work.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    title: "Community-Rooted",
    body: "Carried forward within the All Christians Fellowship Mission community Helen served for years.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M3 19c0-3 2.5-5 5-5s5 2 5 5M11 19c0-2.5 2-4.5 5-4.5s5 2 5 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Our Story" title="A legacy of giving, continued." />
      <section className="section">
        <div className={`container ${styles.grid}`}>
          <div className={styles.imageWrap}>
            <Image
              src={placeholderImages.aboutStory}
              alt="Placeholder: WHHF programme photography pending"
              fill
              sizes="(max-width: 900px) 100vw, 520px"
              className={styles.image}
            />
          </div>
          <div className="stack">
            <p>
              The William &amp; Helen Heritage Foundation was established in
              memory of Rev. (Mrs) Helen Titilayo Okoye, who passed away in
              2019. WHHF was created to continue the generosity she was known
              for during her lifetime.
            </p>
            <p>
              WHHF operates under the umbrella of the All Christians
              Fellowship Mission, the same community Rev. (Mrs) Helen
              Titilayo Okoye served for years alongside Rev. Dr. William
              Okoye. Rather than spread support across many causes, the
              Foundation chose to start narrow and deliberate: direct
              financial grants toward chemotherapy and treatment costs for
              indigent cancer patients, distributed in partnership with
              National Hospital, Abuja. Every case is reviewed by the board
              before any funds move, so support reaches the patients who
              need it most, without unnecessary delay.
            </p>
            <p>
              That approach has already translated into real support,
              including a distribution of over ₦1.5M to five indigent
              cancer patients, made on the 4th memorial anniversary of Rev.
              (Mrs) Helen Okoye. It is a small, tangible expression of a
              much larger conviction: that generosity, offered cheerfully
              and without compulsion, is worth continuing, one life at a
              time.
            </p>
            {/*
              TODO: content pending confirmation from the WHHF board — see
              PRD.md §10. In particular: how (or whether) to reflect Rev.
              William Okoye's passing in July 2026 on this page. Do not add or
              remove memorial content without sign-off — see
              docs/content-style-guide.md.
            */}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack">
          <div className={styles.valuesHeader}>
            <p className="eyebrow-label">/ What We Stand For /</p>
            <h2>The values behind every gift.</h2>
          </div>
          <div className={styles.valuesImageWrap}>
            <Image src={sitePhotos.aboutValues} alt="" fill sizes="100vw" className={styles.valuesImage} />
          </div>
          <div className={styles.valuesGrid}>
            {VALUES.map((value) => (
              <Card key={value.title} className={styles.valueCard}>
                <span className={styles.valueIcon} aria-hidden="true">
                  {value.icon}
                </span>
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
