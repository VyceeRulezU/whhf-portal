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

- [x] Unit tests (Vitest, `npm test`): `lib/auth/session.ts`,
      `lib/auth/rateLimit.ts`, `lib/auth/password.ts`, `lib/format/currency.ts`,
      and every `zod` schema in `lib/validation/` (at least one valid + one
      invalid case each) — 45 tests across 10 files
- [x] A permanent Playwright suite (`e2e/`, `@playwright/test`, not the
      raw `playwright` package): admin login (success + wrong password),
      contact form submit — replacing the throwaway verification scripts
      written ad hoc during development. See `e2e/README.md`.
- [ ] Donate flow → thank-you page — blocked on a real payment provider
      being wired in (adapters are still stubbed); documented in `e2e/README.md`
- [x] Wired into `.github/workflows/ci.yml`: unit tests in the `ci` job,
      E2E in a separate `e2e` job against an ephemeral `postgres:17`
      service container (baseline migration applied, throwaway admin
      seeded) — never touches the real Supabase database

## Phase 2 — Error monitoring

- [x] Real-time exception tracking via `@sentry/nextjs`, wired into
      `app/error.tsx`, `app/global-error.tsx`, and every API route's
      catch block (`Sentry.captureException(err)` alongside the existing
      `console.error`).
      **Deliberately NOT using Sentry's automatic `onRequestError` /
      `Sentry.captureRequestError` hook** — that specific integration has
      open GitHub issues causing `AsyncLocalStorage` errors on Cloudflare
      Workers via `@opennextjs/cloudflare` (getsentry/sentry-javascript#18842).
      Verified safe on this exact stack via a real deploy: added a
      temporary `/api/debug-sentry-test` route that called
      `Sentry.captureException` + `Sentry.flush()`, hit it in production,
      confirmed the site stayed healthy (`npm run smoke-test` still all
      green) rather than hitting the documented "Server failed to
      respond" failure mode, then deleted the route.
      `NEXT_PUBLIC_SENTRY_DSN` is set both as a build-time var (in
      `.env.local`, since `NEXT_PUBLIC_*` vars are inlined into the
      client bundle at build time) and as a Cloudflare Worker runtime
      secret (for the server/edge config files).
      Client bundle size grew from ~102 KB to ~185 KB shared JS as a
      result (Sentry's SDK, including session replay) — acceptable
      tradeoff for now; revisit (e.g. drop `replayIntegration`) if it
      becomes a real problem.
- [x] Also have Cloudflare Workers Logs (Phase 0) — kept both rather
      than choosing one, since Workers Logs covers infrastructure-level
      issues Sentry's `nodejs_compat`-emulated runtime might miss.

## Phase 3 — Data safety

- [x] Formalize schema changes through `drizzle-kit` going forward —
      generated a baseline migration (`drizzle/migrations/0000_aberrant_toad.sql`)
      from the current schema and marked it as already-applied against the
      live database (bookkeeping only — no DDL executed, no data touched).
      Every schema change from here on goes through `drizzle-kit generate`
      + `migrate`, not hand-run SQL. See
      `.agent/skills/db-migration-runner/skill.md`.
- [x] Backup / recovery plan — confirmed on Supabase's **free tier**,
      which has no point-in-time recovery. `.github/workflows/db-backup.yml`
      runs a daily `pg_dump` → R2 upload (`scripts/db-backup.js`),
      verified end-to-end against the live database (a real ~325KB dump
      landed in `db-backups/` in R2). Restoring from one hasn't been
      rehearsed yet — worth a dry run before relying on it in a real
      incident.

## Phase 4 — Staging environment

- [x] A second Cloudflare Worker (`whhf-portal-staging`) so a deploy lands
      somewhere safe before production. Decided against a second Supabase
      project — free-tier accounts are single-project, and a second one
      would mean a second set of credentials/backups to manage. Instead:
      one physical database, isolated by Postgres **schema**
      (`public` = production, `staging` = staging), via `DB_SCHEMA` in
      `wrangler.jsonc`'s `env.staging.vars` and a `pgSchema()`-based
      refactor of every table in `lib/db/schema.ts`. Staging reuses
      production's exact Hyperdrive config and KV namespace — no new
      billable Cloudflare resources were created. (Cloudflare Hyperdrive's
      connection string doesn't support `?options=-c search_path=...` —
      confirmed by a real rejected connection — which is why isolation
      happens in application code instead of the connection string.)
      Verified end-to-end against the real deployment: build + `wrangler
      deploy --env staging`, `scripts/smoke-test.js` all green, and a real
      login (`POST /api/admin/login`) against the seeded staging admin
      account returning a valid session cookie that then loads
      `/admin` and `/admin/donations` (200s), reading only the `staging`
      schema.
- [x] `ci.yml` auto-deploys to staging (`deploy-staging` job, gated on
      `ci`+`e2e` passing and only on push to `main`); production stays a
      deliberate manual `wrangler deploy` (no env flag) — see README.md.
      **Needs one manual step to finish activating**: this job reads
      `secrets.CLOUDFLARE_API_TOKEN`, `secrets.CLOUDFLARE_ACCOUNT_ID`, and
      `secrets.NEXT_PUBLIC_SENTRY_DSN` from the GitHub repo's Actions
      secrets — adding secrets is blocked for Claude by an auto-mode
      safety guardrail, so these three need to be added by hand (values
      are the same ones already in `.env.local`):
      ```
      gh secret set CLOUDFLARE_API_TOKEN --body "<value from .env.local>"
      gh secret set CLOUDFLARE_ACCOUNT_ID --body "<value from .env.local>"
      gh secret set NEXT_PUBLIC_SENTRY_DSN --body "<value from .env.local>"
      ```
      **Done** — secrets added, `deploy-staging` job verified passing
      end-to-end in a real GitHub Actions run (build → deploy → smoke-test
      all green).

## Phase 5 — Security hardening

- [x] Admin role separation enforcement — `AdminUser.role` existed in the
      schema but nothing checked it. Scoped narrowly to what
      `.agent/rules/security.md` actually calls out ("a content editor role
      should not be able to export donor PII or refund a transaction");
      there's no refund feature yet, so the only real boundary today is
      donor PII. Added `isFullAdmin(session)` in `lib/auth/session.ts` and
      applied it to the one route that exposes donor email:
      `GET /api/admin/donations/export` now returns 403 for a non-"admin"
      role (previously any valid session could hit it). The CSV-export
      link on `/admin/donations` is also hidden for a non-admin session
      as a UX signal — the enforcement itself lives server-side, a hidden
      link isn't a security boundary on its own. No UI exists yet to
      create a "content_editor" account (only `lib/db/seed.ts` bootstraps
      one "admin" account) — this guard is ready for whenever one is
      added, not exercised by anything today. Covered by a unit test in
      `lib/auth/session.test.ts`.
- [x] Revisit CSP `unsafe-inline` for `script-src`/`style-src` — reviewed,
      decided to keep as-is. Re-verified the reasoning already documented
      in `middleware.ts` still holds: the codebase has zero actual
      `dangerouslySetInnerHTML` usage (confirmed via a repo-wide grep —
      the only hit was a comment explicitly noting it deliberately avoids
      that API), so the residual XSS risk `unsafe-inline` accepts stays
      narrow. The strict alternative (per-request nonce) would force every
      page — including the currently-static marketing pages — into dynamic
      rendering, a real performance/architecture cost. Not worth paying
      for a codebase with no inline-HTML injection points to begin with;
      revisit if that ever changes.

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
