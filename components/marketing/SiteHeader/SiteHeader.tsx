import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import logo from "@/assets/brand/logo.jpg";
import styles from "./SiteHeader.module.css";

/** Shared with the footer's "Explore" column — see app/(marketing)/layout.tsx. */
export const NAV_LINKS = [
  { href: "/about", label: "Our Story" },
  { href: "/programmes", label: "Programmes" },
  { href: "/impact", label: "Impact" },
  { href: "/leadership", label: "Leadership" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.header__inner}>
        <Link href="/" className={styles.header__logo} aria-label="William & Helen Heritage Foundation — home">
          <Image src={logo} alt="" width={72} height={72} priority className={styles.header__logoImage} />
        </Link>
        <nav className={styles.header__nav} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.header__navLink}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/donate" className={styles.header__cta}>
          <Button variant="primary" showIconChip>
            Donate Now
          </Button>
        </Link>
      </div>
    </header>
  );
}
