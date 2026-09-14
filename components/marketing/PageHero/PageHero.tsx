import Image from "next/image";
import { placeholderImages } from "@/lib/content/placeholderImages";
import styles from "./PageHero.module.css";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  /** Defaults to the shared WHHF banner photo so every inner page gets a
      consistent hero without having to pass one. Override per-page once
      topic-specific photography is available. */
  image?: string;
}

/** Shared banner for inner marketing pages (About, Programmes, Impact, Leadership, Contact). */
export function PageHero({ eyebrow, title, lede, image = placeholderImages.homeHero }: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <Image src={image} alt="" fill priority sizes="100vw" className={styles.hero__image} />
      <div className={styles.hero__scrim} />
      <div className={`container ${styles.hero__content}`}>
        {eyebrow && <p className={`eyebrow-label ${styles.eyebrow}`}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {lede && <p className={styles.lede}>{lede}</p>}
      </div>
    </section>
  );
}
