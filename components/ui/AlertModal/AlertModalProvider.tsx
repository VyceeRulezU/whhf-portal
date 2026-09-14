"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./AlertModal.module.css";

export type AlertVariant = "info" | "success" | "error";

interface AlertOptions {
  title: string;
  message: string;
  variant?: AlertVariant;
}

interface AlertContextValue {
  showAlert: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

/**
 * App-wide alert modal — call useAlert().showAlert(...) from anywhere
 * instead of an inline error <p> or a browser alert(). Always centered on
 * screen, one at a time (a new call replaces whatever's currently shown).
 */
export function AlertModalProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertOptions | null>(null);

  const showAlert = useCallback((options: AlertOptions) => {
    setAlert(options);
  }, []);

  const close = useCallback(() => setAlert(null), []);

  useEffect(() => {
    if (!alert) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [alert, close]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div className={styles.overlay} role="presentation" onClick={close}>
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
            <Button variant="primary" onClick={close} className={styles.dismissButton}>
              OK
            </Button>
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
