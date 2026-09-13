# Skill: Component Builder

## Purpose

Scaffold a new UI component (`.tsx` + `.module.css` pair) that automatically
conforms to `design-system.md` and the tokens in `/tokens/`, so no component
is ever built with ad hoc colors or spacing.

## Before you start

Read `.agent/rules/design-system.md` in full and skim
`tokens/design-tokens.json` for the exact variable names available. If the
component you're building already has an entry described in
`design-system.md` (Button, Card, Badge, Input), follow that spec exactly
rather than reinterpreting the reference image yourself.

## File placement

- Generic, reusable across the whole site → `components/ui/ComponentName/`
- Used only within the donation flow → `components/donate/`
- Used only in marketing pages → `components/marketing/`
- Used only in the admin dashboard → `components/admin/`

Each component gets its own folder:

```
components/ui/Button/
  Button.tsx
  Button.module.css
  index.ts        (re-exports Button for a clean import path)
```

## Template — component

```tsx
// components/ui/Button/Button.tsx
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
      className={[styles.button, styles[`button--${variant}`], className]
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
```

## Template — styles (values must come from tokens, never inline hex/px)

```css
/* components/ui/Button/Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-pill);
  font-family: var(--font-family-ui);
  font-weight: 600;
  font-size: var(--font-size-body);
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease,
    border-color 0.15s ease, color 0.15s ease;
}

.button:focus-visible {
  box-shadow: 0 0 0 3px var(--color-focus-ring);
  outline: none;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.button--primary {
  background-color: var(--color-gold);
  color: var(--color-text-on-gold);
}
.button--primary:hover:not(:disabled) {
  background-color: var(--color-gold-hover);
  transform: translateY(-1px);
}

.button--outline {
  background-color: transparent;
  border-color: var(--color-border-strong);
  color: var(--color-text-primary);
}
.button--outline:hover:not(:disabled) {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

.button--ghost {
  background-color: transparent;
  color: var(--color-text-secondary);
  padding-inline: var(--space-2);
}
.button--ghost:hover:not(:disabled) {
  color: var(--color-gold);
  text-decoration: underline;
}

.button__iconChip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-pill);
  background-color: var(--color-bg-true-black);
  color: var(--color-gold);
}
```

## Checklist before considering a component "done"

- [ ] Zero inline hex codes or raw pixel values — everything is a token
- [ ] Keyboard focus is visible (`:focus-visible`, never `outline: none`
      alone)
- [ ] Minimum 44×44px hit target for anything interactive
- [ ] Works with `prefers-reduced-motion` (no required-to-understand motion)
- [ ] Exported via `index.ts` for a clean `import { Button } from
      "@/components/ui/Button"`
- [ ] If it's a variant of something already in `design-system.md` (Button,
      Card, Badge, Input), matches that spec — don't introduce a fifth
      button variant without updating the design system doc first
