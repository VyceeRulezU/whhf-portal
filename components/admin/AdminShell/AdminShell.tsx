"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { DashboardIcon, DonationsIcon, EmailIcon, NewsletterIcon, PagesIcon, ChevronDoubleLeftIcon } from "@/components/admin/icons";
import { NotificationDrawer } from "@/components/admin/NotificationDrawer";
import logo from "@/assets/brand/logo-transparent.png";
import styles from "./AdminShell.module.css";
import type { ReactNode } from "react";
import type { NotificationItem } from "@/components/admin/NotificationDrawer";

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
    links: [
      { href: "/admin/email", label: "Email", Icon: EmailIcon },
      { href: "/admin/newsletter", label: "Newsletter", Icon: NewsletterIcon }
    ]
  },
  {
    label: "Site",
    links: [{ href: "/admin/content", label: "Content", Icon: PagesIcon }]
  }
];

const COLLAPSE_STORAGE_KEY = "whhf-admin-sidebar-collapsed";

/**
 * Admin chrome: a persistent left sidebar on desktop/tablet (collapsible to
 * an icon rail) that collapses to a hamburger-triggered slide-in drawer
 * below 900px — see SiteHeader.tsx's mobile nav for the same open/close/
 * scrim/Escape pattern the drawer mirrors. The top bar lives inside
 * <main>, not spanning over the sidebar, so the sidebar reads as one
 * continuous full-height column. Client component so the drawer and
 * collapse state can live here; the session guard stays in the server
 * layout, which also looks up the signed-in admin's email for the top bar.
 */
interface AdminShellProps {
  children: ReactNode;
  adminEmail: string;
  notifications: NotificationItem[];
  unreadCount: number;
}

export function AdminShell({ children, adminEmail, notifications, unreadCount }: AdminShellProps) {
  const pathname = usePathname();

  // Hides the browser's own document-level scrollbar for the admin
  // section specifically — scoped via a body class (removed on unmount)
  // rather than a sitewide rule, since the public marketing pages should
  // keep a normal scrollbar.
  useEffect(() => {
    document.body.classList.add("admin-scrollbar-hidden");
    return () => document.body.classList.remove("admin-scrollbar-hidden");
  }, []);

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
      {isDrawerOpen && (
        <div className={styles.scrim} onClick={() => setIsDrawerOpen(false)} aria-hidden="true" />
      )}

      <aside
        id="admin-drawer"
        className={`${styles.sidebar} scrollbar-hidden ${isDrawerOpen ? styles["sidebar--open"] : ""}`}
      >
        <div className={styles.brandRow}>
          <Link href="/admin" className={styles.brand}>
            <Image
              src={logo}
              alt="William & Helen Heritage Foundation"
              width={64}
              height={64}
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
              {group.links.map(({ href, label, Icon }) => {
                const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
                return (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  className={`${styles.navLink} ${isActive ? styles["navLink--active"] : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={styles.navLinkIcon} />
                  <span className={styles.navLinkLabel}>{label}</span>
                </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <SignOutButton />
        </div>
      </aside>

      <main className={styles.main}>
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
          <div className={styles.topbarSpacer} />
          <NotificationDrawer notifications={notifications} unreadCount={unreadCount} />
          <span className={styles.topbarEmail}>{adminEmail}</span>
        </header>

        <div className={`section ${styles.mainContent}`}>
          <div className="container">{children}</div>
        </div>
      </main>
    </div>
  );
}
