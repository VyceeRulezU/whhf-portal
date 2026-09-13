import styles from "./Badge.module.css";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  /** Use for at most one "active"/featured badge per view — see design-system.md. */
  featured?: boolean;
}

export function Badge({ children, featured = false }: BadgeProps) {
  return (
    <span
      className={[styles.badge, featured && styles["badge--featured"]]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
