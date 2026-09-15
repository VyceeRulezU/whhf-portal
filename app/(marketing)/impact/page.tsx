import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";
import { sitePhotos } from "@/lib/content/sitePhotos";
import { impactStories } from "@/lib/content/impactStories";
import styles from "./impact.module.css";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "₦1.5M+ distributed to indigent cancer patients at National Hospital, Abuja. See what your generosity has made possible."
};

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Impact"
        title="What your generosity has made possible."
        lede="Confirmed figures below, updated as new distributions are made and admin reporting comes online."
      />
      <section className="section">
        <div className="container stack">
          <div className={styles.imageWrap}>
            <Image src={sitePhotos.impactMain} alt="" fill sizes="100vw" className={styles.image} />
          </div>
          <div className="grid-auto">
            <Card>
              <h3>₦1.5M+</h3>
              <p className={styles.description}>
                Distributed to five indigent cancer patients at National
                Hospital, Abuja, on the 4th memorial anniversary of Rev. (Mrs)
                Helen Okoye.
              </p>
            </Card>
            <Card>
              <h3>5</h3>
              <p className={styles.description}>Patients directly supported in this distribution.</p>
            </Card>
            {/* TODO: pull real cumulative totals from the admin/donation data once live — do not hardcode further placeholder figures. */}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack">
          <div>
            <p className="eyebrow-label">/ Read More /</p>
            <h2>Where your support goes.</h2>
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
