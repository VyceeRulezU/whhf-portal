# AGENTS.md — William & Helen Heritage Foundation (WHHF) Portal

This file is the entry point for any AI agent (Claude Code, Cursor, Copilot, etc.)
working in this repository. Read this fully before writing code. It links out to
the detailed rules and skills — do not duplicate their content here, and do not
skip reading them just because a task looks small.

## What this project is

A public website + donation portal for the **William & Helen Heritage Foundation
(WHHF)**, an Abuja-based NGO founded in memory of Rev. (Mrs) Helen Titilayo Okoye,
under the umbrella of the All Christians Fellowship Mission (ACFM). The portal has
two halves that must both be treated as production-grade from day one, because
real money and real donor data move through it:

1. **Public-facing site** — mission, story, programmes (cancer/indigent patient
   support is the founding cause area), impact reporting, board/leadership,
   contact, and a donate flow.
2. **Donation portal** — donors give (one-off or recurring) via card, bank
   transfer, and mobile money, in both NGN and international currencies (USD/GBP
   at minimum). WHHF also needs to see and export what has come in, for its own
   reporting and regulatory obligations.

See `/PRD.md` for the full product requirements. See `/docs/` for supporting
reference docs. This is a real NGO handling real donor funds — treat every
payment- and data-handling decision as if it will be audited, because it likely
will be (Nigerian CSO fundraising rules + SCUML AML registration apply — see
`docs/compliance-nigeria-ngo.md`).

## Before you start any task

1. Read `.agent/rules/architecture.md` — stack, folder layout, data flow.
2. Read `.agent/rules/code-style.md` — conventions for this codebase.
3. Read `.agent/rules/design-system.md` — the ONLY source of truth for visual
   decisions. Never invent colors, spacing, or type outside the tokens it
   defines.
4. Read `.agent/rules/security.md` before touching anything related to
   payments, auth, donor PII, or admin access.
5. Check `.agent/skills/` for a skill matching your task. If one exists, follow
   it exactly rather than improvising a different pattern.

## Assumed stack (confirm before diverging)

- **Framework**: Next.js (App Router), TypeScript
- **Styling**: Vanilla CSS only — no Tailwind, no CSS-in-JS, no component
  library CSS. See `code-style.md` for the CSS methodology and `tokens/` for
  the variables every stylesheet must consume.
- **Database**: Postgres via Drizzle ORM, Cloudflare Hyperdrive binding in
  production — every query goes through `withDb()` in `lib/db/client.ts`,
  never a cached client (see `db-migration-runner` skill)
- **Payments**: Flutterwave, Paystack, and Korapay — see the three
  `*-integration` skills. Do not add a fourth provider without updating
  `PRD.md` and `security.md` first.
- **Hosting**: not yet decided — do not hardcode a platform-specific API
  (e.g. Vercel-only primitives) without flagging it.

If a task seems to require a different stack choice, stop and ask rather than
silently introducing a new dependency.

## Non-negotiables

- Never commit secrets, API keys, or `.env*` files. All payment provider keys
  are server-side only (see `security.md`).
- Never log full card numbers, account numbers, BVNs, or full donor addresses.
- Every donation-facing page must work with JavaScript-optional graceful
  degradation for the initial form render (progressive enhancement), and must
  be keyboard-accessible.
- The design system in `design-system.md` is derived directly from the WHHF
  logo (`assets/brand/logo.jpg`). Do not substitute a generic palette (e.g. a
  stock near-black + acid-green SaaS look) — the black/gold/silver palette IS
  the brand, not a placeholder.
- Money amounts are always handled as integers (kobo/cents), never floats.

## Open items the human owner is tracking

- Rev. William Okoye (co-founder, ACFM General Overseer) passed away in July
  2026. Whether/how this is reflected in site content (memoriam page, About
  page framing) is a content decision, not an engineering one — do not add or
  remove memorial content on your own judgment; flag it for the content owner.
- CAC registration, SCUML status, and bank details exist but haven't been
  transcribed into this repo yet — see `docs/compliance-nigeria-ngo.md` for
  what's still needed.
