"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./AlertModal.module.css";

export type AlertVariant = "info" | "success" | "error";

interface AlertOptions {
  title: string;
  message: string;
  variant?: AlertVariant;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styles the confirm button red instead of gold — for a destructive
      action like a delete, not a routine "are you sure". */
  danger?: boolean;
}

interface AlertContextValue {
  showAlert: (options: AlertOptions) => void;
  /** Replaces window.confirm() with the app's own modal — resolves true
      on Confirm, false on Cancel/Escape/clicking outside. */
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextValue | null>(null);

/**
 * App-wide alert + confirm modal — call useAlert().showAlert(...) or
 * .showConfirm(...) from anywhere instead of an inline error <p>, a
 * browser alert(), or a browser confirm(). Always centered on screen, one
 * at a time (a new call replaces whatever's currently shown).
 */
export function AlertModalProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertOptions | null>(null);
  const [confirm, setConfirm] = useState<ConfirmOptions | null>(null);
  const resolveConfirmRef = useRef<((value: boolean) => void) | null>(null);

  const showAlert = useCallback((options: AlertOptions) => {
    setAlert(options);
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveConfirmRef.current = resolve;
      setConfirm(options);
    });
  }, []);

  const closeAlert = useCallback(() => setAlert(null), []);

  const resolveConfirm = useCallback((value: boolean) => {
    resolveConfirmRef.current?.(value);
    resolveConfirmRef.current = null;
    setConfirm(null);
  }, []);

  useEffect(() => {
    if (!alert && !confirm) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (confirm) resolveConfirm(false);
      else closeAlert();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [alert, confirm, closeAlert, resolveConfirm]);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {alert && (
        <div className={styles.overlay} role="presentation" onClick={closeAlert}>
          <div
            className={styles.modal}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="alert-modal-title"
            aria-describedby="alert-modal-message"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className={`${styles.icon} ${styles[`icon--${alert.variant ?? "info"}`]}`}
              aria-hidden="true"
            >
              {alert.variant === "error" ? "!" : alert.variant === "success" ? "✓" : "i"}
            </span>
            <h2 id="alert-modal-title" className={styles.title}>
              {alert.title}
            </h2>
            <p id="alert-modal-message" className={styles.message}>
              {alert.message}
            </p>
            <Button variant="primary" onClick={closeAlert} className={styles.dismissButton}>
              OK
            </Button>
          </div>
        </div>
      )}
      {confirm && (
        <div className={styles.overlay} role="presentation" onClick={() => resolveConfirm(false)}>
          <div
            className={styles.modal}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-message"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className={`${styles.icon} ${styles[`icon--${confirm.danger ? "error" : "info"}`]}`}
              aria-hidden="true"
            >
              {confirm.danger ? "!" : "?"}
            </span>
            <h2 id="confirm-modal-title" className={styles.title}>
              {confirm.title}
            </h2>
            <p id="confirm-modal-message" className={styles.message}>
              {confirm.message}
            </p>
            <div className={styles.confirmActions}>
              <Button variant="outline" onClick={() => resolveConfirm(false)}>
                {confirm.cancelLabel ?? "Cancel"}
              </Button>
              <Button
                variant="primary"
                onClick={() => resolveConfirm(true)}
                // Inline style, not a competing CSS Module class: a class
                // here would have the same specificity as Button's own
                // .button--primary, and which one wins would depend on
                // webpack's cross-file chunk order — the exact class of
                // bug CardCarousel hit earlier (see its module.css note).
                // An inline style always wins, no ordering question.
                style={confirm.danger ? { backgroundColor: "var(--color-error)" } : undefined}
              >
                {confirm.confirmLabel ?? "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextValue {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertModalProvider");
  return ctx;
}
