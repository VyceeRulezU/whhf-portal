import styles from "./Select.module.css";
import type { SelectHTMLAttributes } from "react";
import { useId } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
}

/** Same field/label/hint/error shell as Input and Textarea, wrapping a
    native <select> (appearance reset, custom chevron) instead of an
    <input> or <textarea>. */
export function Select({ label, options, placeholder, error, hint, id, className, ...rest }: SelectProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.field__label}>
        {label}
      </label>
      <div className={styles.selectWrap}>
        <select
          id={inputId}
          className={[styles.field__input, error && styles["field__input--error"], className]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={Boolean(error)}
          aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg className={styles.chevron} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 4.5L7 9.5L12 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
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
