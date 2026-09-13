import Image from "next/image";
import Link from "next/link";
import { SiteHeader, NAV_LINKS } from "@/components/marketing/SiteHeader";
import logo from "@/assets/brand/logo.jpg";
import styles from "./marketing-layout.module.css";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className={`visually-hidden ${styles.skipLink}`}>
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <footer className={styles.footer}>
        <div className={`container ${styles.footer__grid}`}>
          <div className={styles.footer__brand}>
            <Image src={logo} alt="William & Helen Heritage Foundation" width={56} height={56} />
            <p className={styles.footer__tagline}>
              Continuing a legacy of giving, under the umbrella of the All
              Christians Fellowship Mission (ACFM).
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
            <p className={styles.footer__heading}>Give</p>
            <ul className={styles.footer__list}>
              <li>
                <Link href="/donate">Donate Now</Link>
              </li>
              <li>
                <Link href="/contact">Partner with us</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={`container ${styles.footer__bottom}`}>
          <p>© {new Date().getFullYear()} William &amp; Helen Heritage Foundation, Abuja, Nigeria.</p>
          <p className={styles.footer__registration}>
            {/* Placeholder — do not fabricate a number. See docs/compliance-nigeria-ngo.md */}
            CAC registration number: pending confirmation
          </p>
        </div>
      </footer>
    </>
  );
}
