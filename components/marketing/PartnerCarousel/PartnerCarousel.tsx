import Image from "next/image";
import styles from "./PartnerCarousel.module.css";

interface Partner {
  name: string;
  logo: string;
}

interface PartnerCarouselProps {
  partners: Partner[];
}

/**
 * Looping partner-logo band. No real partner logos exist yet, so this
 * renders as an empty gold band by default (see lib/content/registry.ts's
 * "home.partners", currently an empty list) — the family adds real ones
 * later at /admin/content/home, no code change needed. Previously held
 * fictional placeholder logos; removed per AGENTS.md's "do not invent
 * partner identities" once a real add-your-own mechanism existed.
 */
export function PartnerCarousel({ partners }: PartnerCarouselProps) {
  if (partners.length === 0) {
    return <section className={styles.band} aria-hidden="true" />;
  }

  // Rendered twice back-to-back so the CSS animation can loop seamlessly
  // from -0% to -50% and land exactly back on the first copy.
  const track = [...partners, ...partners];

  return (
    <section className={styles.band} aria-label="Our partners">
      <div className={styles.track}>
        {track.map((partner, index) => (
          <span className={styles.logo} key={`${partner.name}-${index}`} aria-hidden={index >= partners.length}>
            <Image src={partner.logo} alt={partner.name} width={140} height={52} className={styles.logoImage} />
          </span>
        ))}
      </div>
    </section>
  );
}
