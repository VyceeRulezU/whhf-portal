# End-to-end tests

Replaces the throwaway Playwright verification scripts written by hand
during development (see `docs/production-readiness.md` Phase 1) with a
small, permanent suite. Uses `@playwright/test`, not the raw `playwright`
package.

## Running locally

1. Start the app against a real (local or dev) database:
   ```bash
   npm run dev
   ```
2. Seed an admin account if you haven't already (see the root README's
   "Creating a local admin user"), then export the same credentials:
   ```bash
   E2E_ADMIN_EMAIL=you@example.com E2E_ADMIN_PASSWORD='your-seeded-password' npx playwright test
   ```
   Omit the `E2E_ADMIN_*` vars to run everything except the admin login
   spec (it self-skips without them).

First run: `npx playwright install chromium` to fetch the browser binary.

## What CI does differently

`.github/workflows/ci.yml`'s `e2e` job spins up an ephemeral `postgres:17`
service container (nothing real, destroyed after the job), applies
`drizzle/migrations/0000_aberrant_toad.sql` directly via `psql`, seeds one
throwaway admin account, builds and starts the app against that database,
then runs this suite against it. It never touches the real Supabase
database.

## Why not a full donate-flow test yet

The donation flow's payment providers (`lib/payments/*`) are still
stubbed (see `docs/security-status.md`) — `initialize` throws "not yet
implemented". A true amount → payment → thank-you end-to-end test is
blocked on that; add it once a real provider is wired in.
