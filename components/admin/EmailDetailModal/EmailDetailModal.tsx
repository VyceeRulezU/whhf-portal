"use client";

import { useEffect } from "react";
import styles from "./EmailDetailModal.module.css";

interface MetaRow {
  label: string;
  value: string;
}

interface EmailDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  meta: MetaRow[];
  body: string;
  actions?: React.ReactNode;
}

/**
 * Read-only "View" modal shared by all three Email tabs (Inbox, Contact
 * Form, Outgoing) — each tab builds its own meta rows (From/To/Date, or
 * Name/Email/Phone/Date, or To/Cc/Bcc/Date) and passes them in, so this
 * component only owns the overlay/Escape/click-outside shell and layout,
 * not any tab-specific data shape. Same pattern as ComposeEmailModal.
 */
export function EmailDetailModal({ isOpen, onClose, subject, meta, body, actions }: EmailDetailModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={`${styles.modal} scrollbar-hidden`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="email-detail-title">{subject}</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <dl className={styles.metaList}>
          {meta.map((row) => (
            <div key={row.label} className={styles.metaRow}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>

        <p className={styles.body}>{body}</p>

        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
}
