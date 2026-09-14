import styles from "./Textarea.module.css";
import type { TextareaHTMLAttributes } from "react";
import { useId } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, id, className, ...rest }: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.field__label}>
        {label}
      </label>
      <textarea
        id={inputId}
        className={[styles.field__input, error && styles["field__input--error"], className]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={Boolean(error)}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className={styles.field__hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.field__error} role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
