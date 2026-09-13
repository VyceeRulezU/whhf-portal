import styles from "./PageHero.module.css";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  lede?: string;
}

/** Shared banner for inner marketing pages (About, Programmes, Impact, Leadership, Contact). */
export function PageHero({ eyebrow, title, lede }: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <div className="container stack">
        {eyebrow && <p className={`eyebrow-label ${styles.eyebrow}`}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {lede && <p className={styles.lede}>{lede}</p>}
      </div>
    </section>
  );
}
