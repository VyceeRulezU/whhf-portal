import styles from "./Button.module.css";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  showIconChip?: boolean;
}

export function Button({
  variant = "primary",
  showIconChip = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        styles.button,
        styles[`button--${variant}`],
        showIconChip && styles["button--withIconChip"],
        className
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      <span className={styles.button__label}>{children}</span>
      {showIconChip && (
        <span className={styles.button__iconChip} aria-hidden="true">
          →
        </span>
      )}
    </button>
  );
}
