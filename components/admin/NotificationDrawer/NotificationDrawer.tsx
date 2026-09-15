"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BellIcon, EmailIcon, DonationsIcon } from "@/components/admin/icons";
import styles from "./NotificationDrawer.module.css";

export interface NotificationItem {
  id: string;
  type: "email" | "message" | "donation";
  title: string;
  description: string;
  href: string;
  createdAt: Date;
}

interface NotificationDrawerProps {
  notifications: NotificationItem[];
  unreadCount: number;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const TYPE_ICON = { email: EmailIcon, message: EmailIcon, donation: DonationsIcon };

// Endpoint each notification type's "mark as read" reuses — the same ones
// the Email page's own row actions call (see EmailView.tsx), so
// read-state stays consistent whichever surface the admin clicks from.
// Donation items have no read/unread concept, so they get no action.
function readEndpointFor(item: NotificationItem): { url: string; init: RequestInit } | null {
  if (item.type === "email") {
    const emailId = item.id.replace(/^email-/, "");
    return { url: `/api/admin/inbox/${emailId}`, init: { method: "PATCH" } };
  }
  if (item.type === "message") {
    const messageId = item.id.replace(/^message-/, "");
    return {
      url: `/api/admin/messages/${messageId}`,
      init: {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" })
      }
    };
  }
  return null;
}

/** Bell trigger + a right-side sliding drawer listing unread email/
    messages and recent donations — the same fixed-panel + scrim + Escape
    pattern as AdminShell's mobile sidebar drawer. Items can be marked as
    read individually or all at once; marking removes them from the list
    immediately (every email/message item here is unread by construction —
    see the layout's notification query) and router.refresh() re-syncs the
    server-rendered badge count against the DB. */
export function NotificationDrawer({ notifications, unreadCount }: NotificationDrawerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  // timeAgo() depends on Date.now(), which differs between the server's
  // render pass and the client's hydration pass — rendering it only after
  // mount keeps the very first client render identical to the SSR output
  // (both skip it), avoiding a hydration mismatch.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // The server-rendered list can change (new notification arrives) between
  // renders, so clear stale dismissals rather than let the set grow forever.
  useEffect(() => {
    setDismissedIds((prev) => {
      const stillPresent = new Set([...prev].filter((id) => notifications.some((item) => item.id === id)));
      return stillPresent.size === prev.size ? prev : stillPresent;
    });
  }, [notifications]);

  const visibleNotifications = useMemo(
    () => notifications.filter((item) => !dismissedIds.has(item.id)),
    [notifications, dismissedIds]
  );
  const readableNotifications = useMemo(() => visibleNotifications.filter((item) => readEndpointFor(item)), [
    visibleNotifications
  ]);

  async function markAsRead(item: NotificationItem) {
    const endpoint = readEndpointFor(item);
    if (!endpoint) return;
    setMarkingId(item.id);
    try {
      await fetch(endpoint.url, endpoint.init);
      setDismissedIds((prev) => new Set(prev).add(item.id));
      router.refresh();
    } finally {
      setMarkingId(null);
    }
  }

  async function markAllAsRead() {
    setIsMarkingAll(true);
    try {
      await Promise.all(
        readableNotifications.map((item) => {
          const endpoint = readEndpointFor(item);
          return endpoint ? fetch(endpoint.url, endpoint.init) : Promise.resolve();
        })
      );
      setDismissedIds((prev) => {
        const next = new Set(prev);
        for (const item of readableNotifications) next.add(item.id);
        return next;
      });
      router.refresh();
    } finally {
      setIsMarkingAll(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={isOpen}
      >
        <BellIcon />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>

      {isOpen && <div className={styles.scrim} onClick={() => setIsOpen(false)} aria-hidden="true" />}

      <aside
        className={`${styles.drawer} scrollbar-hidden ${isOpen ? styles["drawer--open"] : ""}`}
        aria-hidden={!isOpen}
      >
        <div className={styles.drawerHeader}>
          <h2>Notifications</h2>
          <div className={styles.drawerHeaderActions}>
            {readableNotifications.length > 0 && (
              <button type="button" className={styles.markAllButton} onClick={markAllAsRead} disabled={isMarkingAll}>
                {isMarkingAll ? "Marking…" : "Mark all as read"}
              </button>
            )}
            <button type="button" className={styles.closeButton} onClick={() => setIsOpen(false)} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {visibleNotifications.length === 0 ? (
          <p className={styles.empty}>Nothing new right now.</p>
        ) : (
          <ul className={styles.list}>
            {visibleNotifications.map((item) => {
              const Icon = TYPE_ICON[item.type];
              const canMarkRead = readEndpointFor(item) !== null;
              return (
                <li key={item.id} className={styles.item}>
                  <Link href={item.href} className={styles.itemLink} onClick={() => setIsOpen(false)}>
                    <span className={`${styles.itemIcon} ${styles[`itemIcon--${item.type}`]}`} aria-hidden="true">
                      <Icon />
                    </span>
                    <span className={styles.itemBody}>
                      <span className={styles.itemTitle}>{item.title}</span>
                      <span className={styles.itemDescription}>{item.description}</span>
                    </span>
                    <span className={styles.itemTime}>{mounted ? timeAgo(item.createdAt) : ""}</span>
                  </Link>
                  {canMarkRead && (
                    <button
                      type="button"
                      className={styles.markReadButton}
                      onClick={() => markAsRead(item)}
                      disabled={markingId === item.id}
                      aria-label="Mark as read"
                      title="Mark as read"
                    >
                      {markingId === item.id ? (
                        "…"
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M3 8.5L6.5 12L13 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </>
  );
}
