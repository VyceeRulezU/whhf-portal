"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { DashboardIcon, DonationsIcon, EmailIcon, ChevronDoubleLeftIcon } from "@/components/admin/icons";
import logo from "@/assets/brand/logo-transparent.png";
import styles from "./AdminShell.module.css";
import type { ReactNode } from "react";

const NAV_GROUPS = [
  {
    label: "Overview",
    links: [{ href: "/admin", label: "Dashboard", Icon: DashboardIcon }]
  },
  {
    label: "Fundraising",
    links: [{ href: "/admin/donations", label: "Donations", Icon: DonationsIcon }]
  },
  {
    label: "Communications",
    links: [{ href: "/admin/email", label: "Email", Icon: EmailIcon }]
  }
];

const COLLAPSE_STORAGE_KEY = "whhf-admin-sidebar-collapsed";

/**
 * Admin chrome: a persistent left sidebar on desktop/tablet (collapsible to
 * an icon rail) that collapses to a hamburger-triggered slide-in drawer
 * below 900px — see SiteHeader.tsx's mobile nav for the same open/close/
 * scrim/Escape pattern the drawer mirrors. Client component so the drawer
 * and collapse state can live here; the session guard stays in the server
 * layout, which also looks up the signed-in admin's email for the top bar.
 */
export function AdminShell({ children, adminEmail }: { children: ReactNode; adminEmail: string }) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(COLLAPSE_STORAGE_KEY);
    if (stored === "true") setIsCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setIsCollapsed((collapsed) => {
      const next = !collapsed;
      window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
      return next;
    });
  }

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
    <div className={`${styles.shell} ${isCollapsed ? styles["shell--collapsed"] : ""}`}>
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
          <Image src={logo} alt="William & Helen Heritage Foundation" width={32} height={32} />
        </Link>
        <div className={styles.topbarSpacer} />
        <div className={styles.topbarUser}>
          <span className={styles.topbarEmail}>{adminEmail}</span>
          <SignOutButton />
        </div>
      </header>

      <div className={styles.body}>
        {isDrawerOpen && (
          <div className={styles.scrim} onClick={() => setIsDrawerOpen(false)} aria-hidden="true" />
        )}

        <aside id="admin-drawer" className={`${styles.sidebar} ${isDrawerOpen ? styles["sidebar--open"] : ""}`}>
          <div className={styles.brandRow}>
            <Link href="/admin" className={styles.brand}>
              <Image
                src={logo}
                alt="William & Helen Heritage Foundation"
                width={44}
                height={44}
                className={styles.brandImage}
              />
            </Link>
            <button
              type="button"
              className={styles.collapseToggle}
              onClick={toggleCollapsed}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronDoubleLeftIcon className={styles.collapseIcon} />
            </button>
          </div>
          <nav className={styles.nav} aria-label="Admin">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className={styles.navGroup}>
                <p className={styles.navGroupLabel}>{group.label}</p>
                {group.links.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    title={label}
                    className={`${styles.navLink} ${pathname === href ? styles["navLink--active"] : ""}`}
                    aria-current={pathname === href ? "page" : undefined}
                  >
                    <Icon className={styles.navLinkIcon} />
                    <span className={styles.navLinkLabel}>{label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <main className={`section ${styles.main}`}>
          <div className="container">{children}</div>
        </main>
      </div>
    </div>
  );
}
