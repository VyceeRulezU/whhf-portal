"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import logo from "@/assets/brand/logo-transparent.png";
import { ALL_NAV_LINKS, MORE_LINKS, NAV_LINKS } from "./navLinks";
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
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const isMoreLinkActive = MORE_LINKS.some((link) => link.href === pathname);

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

  // Route change closes the mobile menu and mega menu rather than leaving
  // either open behind the newly-navigated page.
  useEffect(() => {
    setIsMenuOpen(false);
    setIsMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen && !isMoreOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsMoreOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, isMoreOpen]);

  // Mega menu closes on any click outside its trigger/panel — a plain
  // dropdown convention users already expect.
  useEffect(() => {
    if (!isMoreOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMoreOpen]);

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
          <div className={styles.moreMenu} ref={moreRef}>
            <button
              type="button"
              className={`${styles.header__navLink} ${styles.moreMenu__trigger} ${isMoreLinkActive ? styles["header__navLink--active"] : ""}`}
              aria-expanded={isMoreOpen}
              aria-haspopup="true"
              onClick={() => setIsMoreOpen((open) => !open)}
            >
              More
              <span className={`${styles.moreMenu__chevron} ${isMoreOpen ? styles["moreMenu__chevron--open"] : ""}`} aria-hidden="true">
                ▾
              </span>
            </button>
            <AnimatePresence>
              {isMoreOpen && (
                <motion.div
                  className={styles.moreMenu__panel}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                >
                  {MORE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={styles.moreMenu__link}
                      onClick={() => setIsMoreOpen(false)}
                    >
                      <span className={styles.moreMenu__linkLabel}>{link.label}</span>
                      <span className={styles.moreMenu__linkDescription}>{link.description}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                {ALL_NAV_LINKS.map((link) => (
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
