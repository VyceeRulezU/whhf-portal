# Code Style

## General

- TypeScript everywhere, strict mode on. Prefer explicit types on function
  boundaries (params + return); internal inference is fine.
- Functional React components only. No class components.
- Server components by default; add `"use client"` only when you need state,
  effects, or browser APIs.
- One component per file. File name matches the component name
  (`DonationForm.tsx`, not `index.tsx`, except for route files Next.js
  requires to be named `page.tsx`/`layout.tsx`/`route.ts`).
- Validate all external input (form submissions, API bodies, webhook
  payloads) with `zod` schemas in `lib/validation/`, shared between client
  and server where the shape is identical.
- Prefer named exports. Default exports only where Next.js requires them
  (`page.tsx`, `layout.tsx`).

## CSS methodology (vanilla CSS — no framework)

We use **CSS Modules with BEM-flavoured class names**, so specificity stays
flat and predictable without a utility framework:

- Every component gets its own `ComponentName.module.css`, colocated next to
  the component file.
- Class names inside a module: `.card`, `.card__header`, `.card--featured`
  (block / element / modifier). The module scoping already namespaces the
  file, so you don't need to prefix with the component name.
- Global styles (reset, typography defaults, `:root` tokens) live only in
  `/styles/base/` and are imported once in the root layout. Nothing else
  writes global selectors.
- **Every color, spacing, radius, shadow, font-size, and transition value
  must come from a CSS variable defined in `/tokens/tokens.css`.** No hex
  codes, no magic pixel numbers, inside component modules. If a value you
  need doesn't exist as a token, add it to the tokens first (and to
  `design-tokens.json`, which is the source `tokens.css` is generated from —
  see `tokens/generate-css-variables.js`), don't inline it.
- Layout primitives (flex/grid gap, max-width containers, section padding)
  should reuse the primitives in `/styles/base/layout.css` rather than each
  component reinventing a container div.
- Use logical properties where practical (`margin-inline`, `padding-block`)
  for easier future RTL/i18n support — not required for launch but costs
  nothing now.
- Respect `prefers-reduced-motion` for any transition longer than a simple
  hover color change.

## Naming

- Booleans read as questions: `isLoading`, `hasError`, `canSubmit`.
- Money is always an integer in the smallest currency unit (`amountKobo`,
  `amountCents`), never a float. Convert to display units only at render
  time, in a single formatting helper (`lib/format/currency.ts`).
- Donation/payment status is a closed union, not a free string:
  `"pending" | "processing" | "succeeded" | "failed" | "refunded"`.

## Commits & PRs

- Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`).
- Anything touching `/lib/payments`, `/api/webhooks`, or auth requires a PR
  description stating what was manually tested (webhooks are hard to unit
  test meaningfully — see `security.md` for the webhook testing approach).

## Testing

- Unit test `lib/payments/*` adapters against recorded fixture responses,
  not live provider calls.
- Unit test all `zod` validation schemas with at least one valid and one
  invalid case.
- Don't chase 100% coverage on marketing pages; do chase it on anything that
  touches money or donor PII.
