# Skill: DB Migration Runner

## Purpose

Standardize how schema changes are made to the Drizzle/Postgres database so
migrations stay reversible, reviewable, and safe to run against a database
that already has real donation data in it post-launch.

## Before you start

Read `.agent/rules/architecture.md` for the current data model context and
`.agent/rules/security.md` for what donor data may/may not be stored.

## Before the first migration ever

`lib/db/schema.ts` was hand-written to match tables that already exist in
production (originally created by a since-removed Prisma migration — see
`drizzle.config.ts`). No baseline migration has been recorded, so
`drizzle-kit generate` has nothing to diff against and will emit a full
`CREATE TABLE ...` for every table, even though they already exist —
running `db:migrate` with that file would collide with the live schema.
Before running `db:migrate` for the very first real schema change,
establish a baseline: generate the migration, then mark it as already
applied (insert its record into drizzle's migrations-tracking table
directly) instead of letting the migrator execute the `CREATE TABLE`
statements against a database that already has those tables.

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
