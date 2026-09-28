"use client";

import { useId, useState } from "react";
import type { InputHTMLAttributes } from "react";
import inputStyles from "../Input/Input.module.css";
import styles from "./PasswordInput.module.css";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  hint?: string;
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M1.5 9S4.5 3.5 9 3.5 16.5 9 16.5 9 13.5 14.5 9 14.5 1.5 9 1.5 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M1.5 9S4.5 3.5 9 3.5 16.5 9 16.5 9 13.5 14.5 9 14.5 1.5 9 1.5 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 3l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Same field shell/styling as components/ui/Input, plus a show/hide
    toggle — used for the admin login password field (the only password
    input in the app; donors never have an account). */
export function PasswordInput({ label, error, hint, id, className, ...rest }: PasswordInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={inputStyles.field}>
      <label htmlFor={inputId} className={inputStyles.field__label}>
        {label}
      </label>
      <div className={styles.wrapper}>
        <input
          id={inputId}
          type={isVisible ? "text" : "password"}
          className={[inputStyles.field__input, styles.input, error && inputStyles["field__input--error"], className]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={Boolean(error)}
          aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
          {...rest}
        />
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {hint && !error && (
        <p id={hintId} className={inputStyles.field__hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={inputStyles.field__error} role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
