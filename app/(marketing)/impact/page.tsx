import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";
import { impactStories } from "@/lib/content/impactStories";
import { getPageContent } from "@/lib/content/getPageContent";
import styles from "./impact.module.css";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "₦1.5M+ distributed to indigent cancer patients at National Hospital, Abuja. See what your generosity has made possible."
};

export default async function ImpactPage() {
  const content = await getPageContent("impact");

  return (
    <>
      <PageHero
        eyebrow={content["impact.hero.eyebrow"] as string}
        title={content["impact.hero.title"] as string}
        lede={content["impact.hero.lede"] as string}
      />
      <section className="section">
        <div className="container stack">
          <div className={styles.imageWrap}>
            <Image src={content["impact.image"] as string} alt="" fill sizes="100vw" className={styles.image} />
          </div>
          <div className="grid-auto">
            <Card>
              <h3>{content["impact.stat1.figure"] as string}</h3>
              <p className={styles.description}>{content["impact.stat1.description"] as string}</p>
            </Card>
            <Card>
              <h3>{content["impact.stat2.figure"] as string}</h3>
              <p className={styles.description}>{content["impact.stat2.description"] as string}</p>
            </Card>
            {/* TODO: pull real cumulative totals from the admin/donation data once live — do not hardcode further placeholder figures. */}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack">
          <div>
            <p className="eyebrow-label">/ Read More /</p>
            <h2>{content["impact.stories.heading"] as string}</h2>
          </div>
          <div className={styles.storyGrid}>
            {impactStories.map((story) => (
              <Link key={story.slug} href={`/impact/${story.slug}`} className={styles.storyCard}>
                <div className={styles.storyCardImageWrap}>
                  <Image
                    src={story.image}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 300px"
                    className={styles.storyCardImage}
                  />
                </div>
                <div className={styles.storyCardBody}>
                  <h3 className={styles.storyCardTitle}>{story.title}</h3>
                  <p className={styles.storyCardExcerpt}>{story.excerpt}</p>
                  <span className={styles.storyCardLink}>
                    Read More <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
