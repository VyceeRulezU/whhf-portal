import Image from "next/image";
import { PageHero } from "@/components/marketing/PageHero";
import { placeholderImages } from "@/lib/content/placeholderImages";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Our Story" title="A legacy of giving, continued." />
      <section className="section">
        <div className={`container ${styles.grid}`}>
          <div className={styles.imageWrap}>
            <Image
              src={placeholderImages.aboutStory}
              alt="Placeholder — WHHF programme photography pending"
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
    </>
  );
}
