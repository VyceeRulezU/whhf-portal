import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
// Imported directly from navLinks.ts, not the SiteHeader barrel — that
// barrel also re-exports the "use client" SiteHeader component, and a
// Server Component importing a non-component export through a client
// module only gets a client reference back, not the real array.
import { NAV_LINKS } from "@/components/marketing/SiteHeader/navLinks";
// Transparent cutout of assets/brand/logo.jpg (its background keyed out) —
// see assets/brand/README or the generation note in docs — so the mark
// sits directly on the footer panel's own surface color instead of
// showing the logo's own black background plate as a visible square.
import logo from "@/assets/brand/logo-transparent.png";
import styles from "./SiteFooter.module.css";

const VALUES = ["Faith-Led", "Direct to Patients", "Transparent", "Community-Rooted"];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__panel}>
        <div className={`container ${styles.footer__grid}`}>
          <div className={styles.footer__brand}>
            <Image src={logo} alt="William & Helen Heritage Foundation" width={220} height={220} className={styles.footer__logo} />
            <p className={styles.footer__tagline}>
              Continuing a legacy of giving, under the umbrella of the All
              Christians Fellowship Mission (ACFM) — support for indigent
              cancer patients in Abuja and beyond.
            </p>
          </div>

          <div className={styles.footer__column}>
            <p className={styles.footer__heading}>Explore</p>
            <ul className={styles.footer__list}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.footer__column}>
            <p className={styles.footer__heading}>Contact</p>
            {/* TODO: confirm real office address, phone, and email with WHHF
                board — see the same placeholder pattern on /contact. */}
            <ul className={styles.footer__list}>
              <li>Pending confirmation from WHHF</li>
              <li>Abuja, Nigeria</li>
            </ul>
            <Link href="/donate" className={styles.footer__donateLink}>
              Donate Now →
            </Link>
          </div>

          <div className={styles.footer__column}>
            <p className={styles.footer__heading}>What We Stand For</p>
            <div className={styles.footer__values}>
              {VALUES.map((value) => (
                <Badge key={value}>{value}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* SVG text with textLength, not a CSS font-size, is what actually
            fills the full row width edge-to-edge regardless of viewport —
            a font-size (even vw-based) can only approximate a fill since
            it scales height and width together, not target an exact width. */}
        <svg
          className={styles.footer__wordmark}
          viewBox="0 0 1000 130"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="footerWordmarkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(212, 166, 76, 0.3)" />
              <stop offset="100%" stopColor="rgba(212, 166, 76, 0.05)" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="95"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fontFamily="var(--font-family-display)"
            fontWeight="600"
            fontSize="100"
            fill="url(#footerWordmarkGradient)"
          >
            William &amp; Helen Heritage Foundation
          </text>
        </svg>

        <div className={`container ${styles.footer__bottom}`}>
          <div className={styles.footer__bottomRow}>
            <p>© {new Date().getFullYear()} William &amp; Helen Heritage Foundation, Abuja, Nigeria.</p>
            <p className={styles.footer__registration}>
              {/* Placeholder — do not fabricate a number. See docs/compliance-nigeria-ngo.md */}
              CAC registration number: pending confirmation
            </p>
          </div>
          <div className={styles.footer__legalLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
