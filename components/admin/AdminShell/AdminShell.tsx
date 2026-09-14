"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "@/components/admin/SignOutButton";
import logo from "@/assets/brand/logo-transparent.png";
import styles from "./AdminShell.module.css";
import type { ReactNode } from "react";

const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/donations", label: "Donations" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/inbox", label: "Inbox" }
];

/**
 * Admin chrome: a persistent left sidebar on desktop/tablet, collapsing to
 * a hamburger-triggered slide-in drawer below 900px — see
 * SiteHeader.tsx's mobile nav for the same open/close/scrim/Escape
 * pattern this mirrors. Client component so the drawer can hold open
 * state; the session guard itself stays in the server layout.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsDrawerOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={isDrawerOpen}
          aria-controls="admin-drawer"
          aria-label={isDrawerOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsDrawerOpen((open) => !open)}
        >
          <span className={`${styles.menuToggle__bar} ${isDrawerOpen ? styles["menuToggle__bar--topOpen"] : ""}`} />
          <span className={`${styles.menuToggle__bar} ${isDrawerOpen ? styles["menuToggle__bar--midOpen"] : ""}`} />
          <span className={`${styles.menuToggle__bar} ${isDrawerOpen ? styles["menuToggle__bar--bottomOpen"] : ""}`} />
        </button>
        <Link href="/admin" className={styles.topbarBrand}>
          <Image src={logo} alt="" width={28} height={28} />
          <span>WHHF Admin</span>
        </Link>
      </header>

      {isDrawerOpen && (
        <div className={styles.scrim} onClick={() => setIsDrawerOpen(false)} aria-hidden="true" />
      )}

      <aside id="admin-drawer" className={`${styles.sidebar} ${isDrawerOpen ? styles["sidebar--open"] : ""}`}>
        <Link href="/admin" className={styles.brand}>
          <Image src={logo} alt="" width={36} height={36} className={styles.brandImage} />
          <span className={styles.brandText}>WHHF Admin</span>
        </Link>
        <nav className={styles.nav} aria-label="Admin">
          {ADMIN_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles["navLink--active"] : ""}`}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <SignOutButton />
        </div>
      </aside>

      <main className={`section ${styles.main}`}>
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
