# Skill: DB Migration Runner

## Purpose

Standardize how schema changes are made to the Drizzle/Postgres database so
migrations stay reversible, reviewable, and safe to run against a database
that already has real donation data in it post-launch.

## Before you start

Read `.agent/rules/architecture.md` for the current data model context and
`.agent/rules/security.md` for what donor data may/may not be stored.

## Baseline (done — for context only)

`lib/db/schema.ts` was originally hand-written to match tables already
created in production (by a since-removed Prisma migration). As of
`drizzle/migrations/0000_aberrant_toad.sql`, that's been resolved: the
baseline migration was generated from the schema as it stood, then marked
as already applied directly in `drizzle.__drizzle_migrations` (hash +
journal timestamp, computed the same way `drizzle-orm`'s migrator does)
rather than executed — since the tables it describes already existed. Any
schema change between then and now that wasn't captured this way would
show up as an unexpected diff the next time `drizzle-kit generate` runs;
if that happens, treat it the same way (generate, verify, mark-applied
rather than execute) rather than letting the migrator try to recreate
existing objects.

**From here on, every schema change goes through the normal workflow
below** — no more hand-run raw SQL against the live database.

## Workflow

1. Edit `lib/db/schema.ts` with the desired model change.
2. Generate a migration with a descriptive name:
   ```
   npx drizzle-kit generate --name add_donation_recurring_flag
   ```
   Never use a generic name like `update` or `fix`.
3. Review the generated SQL in `drizzle/migrations/<timestamp>_<name>.sql`
   before applying it — Drizzle's diff is usually right but destructive
   column drops/renames need a human (or agent) sanity check.
4. If the change is potentially destructive against production data
   (dropping/renaming a column, changing a type, adding a `NOT NULL` without
   a default), write the migration as two safe steps instead of one:
   - Step A: additive change only, deploy, backfill data.
   - Step B: the destructive cleanup, deployed later once Step A is
     confirmed safe.
   Do this even if it feels slower — this project has real donor records
   from day one after launch.
5. Update any affected `zod` validation schemas in `lib/validation/` and
   TypeScript types in the same PR as the migration — don't let the schema
   and the validation layer drift.
6. Run `npm run db:migrate` (`drizzle-kit migrate`) to apply it.

## Core models to keep in mind (extend, don't fight)

- `Donor` — name, email, (optional) phone/address for compliance, no raw
  payment instrument data ever.
- `Donation` — amount (integer, smallest unit), currency, cause/campaign
  reference, provider, provider transaction reference (unique), status enum,
  timestamps, recurring flag + parent reference if part of a subscription.
- `Campaign`/`Cause` — the programme a donation is earmarked for (e.g.
  "Indigent Cancer Patient Support").
- `AdminUser` — for dashboard auth, roles if/when multiple roles exist.
- `WebhookEvent` (recommended) — log of raw provider events received, keyed
  by provider + event id, so a replay/debugging tool doesn't need to hit the
  provider again and idempotency has an audit trail.

## Every query must go through `withDb`

`lib/db/client.ts` exports `withDb(fn)`, not a shared `db` singleton —
Cloudflare Workers reuses warm isolates across requests, so a module-level
connection pool leaves stale sockets that hang the next request. Any new
query code must call `withDb((db) => ...)` rather than importing a client
directly; see existing routes under `app/api/` for the pattern.

## Checklist before considering a migration "done"

- [ ] Descriptive migration name
- [ ] SQL reviewed for unintended drops/renames
- [ ] Destructive changes split into additive-then-cleanup steps if the
      table may already hold production data
- [ ] Corresponding `zod` schema + TS types updated
- [ ] `npm run db:migrate` run
- [ ] New queries use `withDb`, not a cached client
- [ ] No donor payment-instrument fields introduced (see `security.md`)
