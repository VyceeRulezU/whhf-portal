# WHHF Portal

Public website + donation portal for the **William & Helen Heritage
Foundation (WHHF)**, an Abuja-based NGO founded in memory of Rev. (Mrs)
Helen Titilayo Okoye, under the umbrella of the All Christians Fellowship
Mission (ACFM).

This is a real NGO handling real donor funds. Every payment- and
data-handling decision in this codebase is treated as production-grade,
not a prototype — see [`.agent/rules/security.md`](.agent/rules/security.md).

- **If you're an AI coding agent, start at [`AGENTS.md`](AGENTS.md), not
  here.** It links out to the architecture, code-style, design-system, and
  security rules, plus task-specific skills.
- **Product spec**: [`PRD.md`](PRD.md)
- **Build status / what's left**: [`docs/roadmap.md`](docs/roadmap.md)
- **Security implementation status**: [`docs/security-status.md`](docs/security-status.md)
- **Contributing**: [`CONTRIBUTING.md`](CONTRIBUTING.md)

This README stays high-level and points to those living documents rather
than duplicating them — update the doc that actually owns a fact (roadmap
for "what's done," security-status for "what's implemented vs. stubbed")
rather than this file, so nothing drifts out of sync.

## What this project is

1. **Public-facing site** — mission, founding story, programmes
   (cancer/indigent patient support is the founding cause area), impact
   reporting, board/leadership, and contact.
2. **Donation portal** — donors give (one-off, recurring planned) via card,
   bank transfer, and mobile money, in NGN and international currencies
   (USD/GBP at minimum). WHHF staff can see and export what's come in for
   their own reporting and regulatory obligations.

See [`PRD.md`](PRD.md) for the full product requirements and
[`docs/`](docs) for compliance, content-style, and roadmap references.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript (strict) |
| Styling | Vanilla CSS — CSS Modules + BEM-flavoured class names, no Tailwind/CSS-in-JS |
| Design tokens | JSON source (`tokens/`) → generated `tokens.css` custom properties |
| Database | PostgreSQL via Drizzle ORM, `pg` driver, Cloudflare Hyperdrive binding in production |
| Auth | Minimal signed-cookie session for the admin dashboard only — donors never need an account |
| Payments | Paystack, Flutterwave, Korapay, behind one shared `PaymentProvider` interface |
| Storage | Cloudflare R2 (S3-compatible) — site images, backups, general files |
| Email | Not yet selected (transactional email for receipts) |
| Hosting | Cloudflare Workers, via `@opennextjs/cloudflare` — see "Deploying to Cloudflare Workers" below |

Full rationale for each choice lives in
[`.agent/rules/architecture.md`](.agent/rules/architecture.md).

## Getting started

```bash
npm install
cp .env.example .env.local     # fill in real values — see "Environment variables" below
node tokens/generate-css-variables.js   # regenerate tokens.css from the JSON source
npm run dev
```

The app runs at `http://localhost:3000`. Marketing pages, the `/donate`
flow, and `/admin` (after seeding an admin user — see below) are all
reachable without any payment provider keys configured; the payment
adapters themselves are currently stubbed (see
[docs/security-status.md](docs/security-status.md)) and will throw if you
actually try to initialize a charge.

### Creating a local admin user

`lib/db/seed.ts` only creates an admin account if these are set — never
commit real values for these:

```bash
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='a-strong-password' npm run db:seed
```

### Environment variables

See [`.env.example`](.env.example) for the full, current list with
comments — it's the source of truth, not this README. Broadly:

- `DATABASE_URL` — Postgres connection string.
- `AUTH_SECRET` — HMAC secret for signing admin session cookies.
- `PAYSTACK_*`, `FLUTTERWAVE_*`, `KORAPAY_*` — provider keys/webhook
  secrets. Public/checkout keys only are safe client-side; secret keys and
  webhook signing secrets are server-only — see
  [`.agent/rules/security.md`](.agent/rules/security.md) before wiring in a
  new one.
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — local-only bootstrap admin,
  see above.
- `R2_*` — Cloudflare R2 object storage credentials. See `lib/storage/r2.ts`.
  Scope the API token to the one bucket only, not account-wide.

Never commit `.env` or `.env.local` — both are gitignored.

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run tokens:build` | Regenerate `tokens/tokens.css` from the JSON token source — run after any token edit |
| `npm run db:generate` | Generate a Drizzle migration after a `lib/db/schema.ts` change |
| `npm run db:migrate` | Apply pending Drizzle migrations |
| `npm run db:seed` | Run `lib/db/seed.ts` (see "Creating a local admin user") |
| `npm run cf:build` | Build the Cloudflare Workers bundle (`.open-next/`) — see "Deploying to Cloudflare Workers" |
| `npm run cf:preview` | Build, then run the Worker locally under `wrangler` |
| `npm run cf:deploy` | Build, then deploy to Cloudflare Workers |

## Deploying to Cloudflare Workers

The app deploys to Cloudflare Workers via
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) — config in
`wrangler.jsonc` and `open-next.config.ts`.

**Cloudflare Pages project settings must run the OpenNext build, not plain
`next build`.** If the dashboard's "Build command" is `npm run build`, the
deploy step will fail with `Could not find compiled Open Next config` —
`.open-next/` never gets generated. Set the **Build command** to
`npm run cf:build` and leave the **Deploy command** as `npx wrangler deploy`.

**Database**: `lib/db/client.ts` exports `withDb(fn)`, which resolves a
connection string — the [Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/)
binding (`env.HYPERDRIVE`, read per-request via `getCloudflareContext()`)
in production, `process.env.DATABASE_URL` in local dev — and creates a
fresh `pg.Pool` per call. Workers reuses warm isolates across requests, so
a module-level Pool singleton (the usual Node.js pattern) leaves stale
sockets that hang the next request; every DB call must go through `withDb`
rather than importing a shared client. See the comment in that file, and
the `hyperdrive` binding in `wrangler.jsonc`.

Known gaps before this is production-ready on Workers, already flagged
inline where they matter:

- **Rate limiting**: `lib/auth/rateLimit.ts` is in-memory, which doesn't
  meaningfully work across Workers' distributed isolates — needs a shared
  store (KV, Durable Objects) before relying on it there.
- **CSP**: `script-src` needs `'unsafe-inline'` in production (Next.js
  delivers its hydration payload via inline `<script>` tags) — see the
  comment in `middleware.ts` for why a per-request nonce isn't a drop-in
  fix here (it would force every page into dynamic rendering).

## Project structure

```
AGENTS.md                → start here if you're an AI agent
PRD.md                    → product requirements
CONTRIBUTING.md           → PR checklist, branch/commit conventions
.agent/
  rules/                  → architecture, code-style, design-system, security
  skills/                 → task-specific how-tos (API routes, components,
                             migrations, payment provider integrations)
app/
  (marketing)/            → public pages: home, about, programmes, impact,
                             leadership, contact — shared header/footer layout
  (donate)/                → donation flow: amount → details → payment → confirmation
  admin/
    login/                → outside the auth guard, by design
    (protected)/          → everything behind the admin session check
  api/
    donations/            → create/verify donation records
    webhooks/{provider}/  → signature-verify → server-side re-verify → idempotent update
components/
  ui/                     → generic building blocks (Button, Card, Badge, Input)
  marketing/              → page-specific/shared marketing sections (SiteHeader, PageHero, …)
  donate/                 → donation-flow-specific components
  admin/                  → dashboard-specific components (SignOutButton, …)
lib/
  payments/               → one adapter file per provider + the shared interface + router
  auth/                   → session, password hashing, login rate limiting
  db/                     → Drizzle schema + withDb() connection helper
  validation/             → zod schemas shared by forms + API routes
  format/                 → display-time formatting (currency, etc.)
  content/                → non-CMS content constants (placeholder image URLs, etc.)
styles/base/              → reset, typography, layout primitives — imported once, globally
tokens/                   → design tokens: JSON source + generated tokens.css
assets/brand/             → logo + favicon source files
docs/                     → compliance, content style guide, roadmap, security status
public/                   → static files served as-is
```

## Design system

[`.agent/rules/design-system.md`](.agent/rules/design-system.md) is the
single source of truth for every visual decision — colors, type scale,
spacing, component states, accessibility floor. In short:

- **Every** color, spacing, radius, font-size, and transition value used in
  a component comes from a CSS custom property in `tokens/tokens.css` — no
  hex codes or magic pixel numbers in component styles. If a value doesn't
  exist as a token yet, add it to `tokens/design-tokens.json` (and
  `color-tokens.json` if it's a color) and run
  `node tokens/generate-css-variables.js` — never hand-edit `tokens.css`,
  it's generated.
- Dark theme, black/gold/silver, derived directly from the WHHF logo — not
  a generic template palette.
- No inline `style={{...}}` in components — every style lives in that
  component's colocated `*.module.css` file.

## Payments

Every provider adapter (`lib/payments/{paystack,flutterwave,korapay}.ts`)
implements the same `PaymentProvider` interface
(`lib/payments/types.ts`): `initialize`, `verify`, `parseWebhook`. Routing
between providers is centralized in `lib/payments/router.ts` — UI/API code
never imports a specific adapter directly.

Webhook handlers never trust the webhook payload's amount or status: they
verify the signature, then re-verify server-to-server against the
provider's own API before updating a `Donation` row. See
[`.agent/rules/security.md`](.agent/rules/security.md) ("Payment
integrity") and the matching `.agent/skills/*-integration/skill.md` before
touching any of this.

Current adapter implementation status is tracked in
[`docs/security-status.md`](docs/security-status.md), not here.

## Email

Two separate paths, both surfaced in the admin dashboard:

- **Contact form** (`/contact` → `POST /api/contact`) — saves to
  `ContactMessage` and best-effort emails `CONTACT_INBOX_EMAIL` via Resend
  (`lib/email/resend.ts`). Visible under Admin → Messages.
- **Real inbound email** to any `@whheritagefoundation.org` address (not
  just the contact form) — a separate Cloudflare Worker
  (`workers/email-router/`) receives it via Cloudflare Email Routing and
  forwards it to `POST /api/webhooks/inbound-email`, which saves it to
  `InboundEmail`. Visible under Admin → Inbox. This depends on Cloudflare
  dashboard configuration (Email Routing enabled + a routing rule) that
  isn't part of this codebase — see
  [`workers/email-router/README.md`](workers/email-router/README.md).

## Testing

No automated test suite exists yet. Per
[`.agent/rules/code-style.md`](.agent/rules/code-style.md), when tests are
added: unit-test `lib/payments/*` adapters against recorded fixture
responses (never live provider calls), and unit-test every `zod` schema in
`lib/validation/` with at least one valid and one invalid case. Chase
coverage on anything that touches money or donor PII; marketing pages don't
need it.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the PR checklist, branch/commit
conventions, and review priorities (money correctness and idempotency
first, then donor data handling, then accessibility, then design-system
consistency).
