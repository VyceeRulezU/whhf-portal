# Production Readiness Plan

Tracks the phased hardening work needed to go live, separate from feature
work tracked in [`docs/roadmap.md`](roadmap.md). Payment gateway
integration is its own track (see roadmap) and deliberately not part of
this list. Update checkboxes as work lands; don't let this drift from
what's actually shipped — same rule as `roadmap.md`.

## Phase 0 — Safety net

- [x] CI workflow (`.github/workflows/ci.yml`): typecheck + lint + build
      on every push/PR to `main`
- [x] Fixed ESLint config (`.eslintrc.json` was missing entirely —
      `npm run lint` silently did nothing before this)
- [x] `app/error.tsx` + `app/global-error.tsx` — branded fallback instead
      of Next's default crash screen
- [x] `GET /api/health` — public, unauthenticated DB-backed health check
      for uptime monitoring
- [x] `scripts/smoke-test.js` (`npm run smoke-test`) — hits key routes
      right after a deploy and fails loudly if anything's actually broken,
      instead of finding out from a user
- [x] Cloudflare Workers Logs enabled (`observability.enabled` in
      `wrangler.jsonc`) — real request/exception logs via `wrangler tail`
      and the dashboard, no external service required

## Phase 1 — Tests

- [ ] Unit tests: `lib/auth/session.ts`, `lib/auth/rateLimit.ts`,
      `lib/auth/password.ts` (flagged as a known gap in
      `docs/security-status.md`)
- [ ] Unit tests: donation amount/currency handling
      (`lib/format/currency.ts`, the smallest-unit conversion in
      `components/donate/DonationForm.tsx` and `POST /api/donations`)
- [ ] Unit tests: every `zod` schema in `lib/validation/` (at least one
      valid + one invalid case each — see `CONTRIBUTING.md`)
- [ ] A small, permanent Playwright suite: admin login → dashboard,
      donate flow → thank-you page, contact form submit — replacing the
      throwaway verification scripts written ad hoc during development
- [ ] Wire the above into `ci.yml`

## Phase 2 — Error monitoring

- [ ] Real-time exception tracking (Sentry or equivalent) wired into
      `app/error.tsx`, `app/global-error.tsx`, and server-side error
      handlers — needs an account + DSN from WHHF/the project owner
- [ ] Decide whether Cloudflare Workers Logs (Phase 0) alone is
      sufficient before adding another vendor

## Phase 3 — Data safety

- [ ] Formalize schema changes through `drizzle-kit` going forward — see
      `.agent/skills/db-migration-runner/skill.md`; every schema change so
      far (including this session's `SentEmail`, `NewsletterSubscriber`,
      `SentNewsletter` tables) was hand-run raw SQL directly against the
      live database, with no recorded migration history or rollback path
- [ ] Document a backup / point-in-time-recovery plan for the Supabase
      database — depends on confirming the current Supabase plan tier

## Phase 4 — Staging environment

- [ ] A second Cloudflare Worker + environment so a deploy lands
      somewhere safe before production — needs a decision on a separate
      Supabase project/DB vs. a shared DB with a separate schema
- [ ] `ci.yml` (or a new workflow) auto-deploys to staging on merge;
      production stays a deliberate manual step until Phase 4 is solid

## Phase 5 — Security hardening

- [ ] Admin role separation enforcement — `AdminUser.role` exists in the
      schema but nothing currently checks it (see `docs/security-status.md`)
- [ ] Revisit CSP `unsafe-inline` for `script-src`/`style-src` — see the
      tradeoff already documented in `middleware.ts` (a per-request nonce
      would force every page into dynamic rendering)

## Phase 6 — Docs & public-repo polish

- [ ] Trim `docs/security-status.md` from public view before wider
      review — it's currently a literal checklist of unpatched weaknesses
      on a system that will handle real donor payments; replace with a
      higher-level "what's implemented" doc and track the specific gap
      list somewhere not publicly indexed
- [ ] Review `PRD.md` for anything that reads as internal board/family
      deliberation rather than product spec, and trim before treating this
      repo as a public professional-review sample
- [x] README refreshed to match what's actually shipped
