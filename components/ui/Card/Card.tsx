import styles from "./Card.module.css";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  /** Overlay variant renders a scrim suitable for text over a background image. */
  overlay?: boolean;
  className?: string;
}

export function Card({ children, overlay = false, className }: CardProps) {
  return (
    <div
      className={[styles.card, overlay && styles["card--overlay"], className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
