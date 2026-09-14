"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import logo from "@/assets/brand/logo-transparent.png";
import { NAV_LINKS } from "./navLinks";
import styles from "./SiteHeader.module.css";

// The home hero has its own gold "Donate Now" button — design-system.md
// says a gold CTA should never appear twice at once. Rather than leave the
// header CTA blank while the hero's own button is in view, it starts as
// the quieter outline variant there and only becomes gold once the donor
// has scrolled roughly past the hero. Every other page has no competing
// gold button, so the header CTA is gold there from the start.
const HERO_SCROLL_THRESHOLD_RATIO = 0.5;

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isPastHero, setIsPastHero] = useState(!isHome);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setIsPastHero(true);
      return;
    }

    function handleScroll() {
      setIsPastHero(window.scrollY > window.innerHeight * HERO_SCROLL_THRESHOLD_RATIO);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Route change closes the mobile menu rather than leaving it open behind
  // the newly-navigated page.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMenuOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const ctaVariant = isPastHero ? "primary" : "outline";

  return (
    <header className={styles.header}>
      <div className={styles.header__inner}>
        <Link href="/" className={styles.header__logo} aria-label="William & Helen Heritage Foundation — home">
          <Image src={logo} alt="" width={120} height={120} priority className={styles.header__logoImage} />
        </Link>
        <nav className={styles.header__nav} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.header__navLink} ${pathname === link.href ? styles["header__navLink--active"] : ""}`}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.header__actions}>
          <Link href="/donate" className={styles.header__cta}>
            {/* Icon chip is reserved for the primary variant only — see
                design-system.md ("Buttons"): never pair it with outline/ghost. */}
            <Button variant={ctaVariant} showIconChip={ctaVariant === "primary"}>
              Donate Now
            </Button>
          </Link>
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className={`${styles.menuToggle__bar} ${isMenuOpen ? styles["menuToggle__bar--topOpen"] : ""}`} />
            <span className={`${styles.menuToggle__bar} ${isMenuOpen ? styles["menuToggle__bar--midOpen"] : ""}`} />
            <span className={`${styles.menuToggle__bar} ${isMenuOpen ? styles["menuToggle__bar--bottomOpen"] : ""}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className={styles.mobileNavScrim}
              aria-hidden="true"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
            <motion.nav
              id="mobile-nav"
              aria-label="Mobile"
              className={styles.mobileNav}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <ul className={styles.mobileNav__list}>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`${styles.mobileNav__link} ${pathname === link.href ? styles["mobileNav__link--active"] : ""}`}
                      aria-current={pathname === link.href ? "page" : undefined}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className={styles.mobileNav__ctaRow}>
                <Link href="/donate" className={styles.mobileNav__ctaLink} onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant={ctaVariant}
                    showIconChip={ctaVariant === "primary"}
                    className={styles.mobileNav__ctaButton}
                  >
                    Donate Now
                  </Button>
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
