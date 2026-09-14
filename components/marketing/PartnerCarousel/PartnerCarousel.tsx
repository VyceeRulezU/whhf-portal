import Image from "next/image";
import styles from "./PartnerCarousel.module.css";

/**
 * TEMPORARY placeholder logos — the board is sourcing real partner logos.
 * These are generic, clearly-fictional dummy company logos (not standing
 * in for any real organization), sourced from pigment/fake-logos
 * (CC BY-SA, github.com/pigment/fake-logos) and self-hosted in
 * public/logos/ after running them through SVGO — the originals were
 * bloated legacy Illustrator exports (100KB+ each from an unused
 * decorative pattern definition); optimized they're 3-10KB. Swap
 * PLACEHOLDER_LOGOS for real partner logos when the board supplies them,
 * and this file (and public/logos/) can go away. See AGENTS.md — do not
 * invent partner identities in the meantime.
 */
const PLACEHOLDER_LOGOS = [
  { id: 1, slug: "crofts-accountants", name: "Croft's Accountants" },
  { id: 2, slug: "petes-blinds", name: "Pete's Blinds" },
  { id: 3, slug: "space-cube", name: "SpaceCube Architects" },
  { id: 4, slug: "auto-speed", name: "Autospeed" },
  { id: 5, slug: "greens-food-suppliers", name: "Greens Food Suppliers" },
  { id: 6, slug: "the-web-works", name: "The Web Works" }
] as const;

/** Looping partner-logo band — see the placeholder note above. */
export function PartnerCarousel() {
  // Rendered twice back-to-back so the CSS animation can loop seamlessly
  // from -0% to -50% and land exactly back on the first copy.
  const track = [...PLACEHOLDER_LOGOS, ...PLACEHOLDER_LOGOS];

  return (
    <section className={styles.band} aria-label="Our partners">
      <div className={styles.track}>
        {track.map((logo, index) => (
          <span className={styles.logo} key={`${logo.id}-${index}`} aria-hidden={index >= PLACEHOLDER_LOGOS.length}>
            <Image src={`/logos/${logo.slug}.svg`} alt={logo.name} width={100} height={36} className={styles.logoImage} />
          </span>
        ))}
      </div>
    </section>
  );
}
