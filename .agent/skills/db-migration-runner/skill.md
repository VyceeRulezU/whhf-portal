# Skill: DB Migration Runner

## Purpose

Standardize how schema changes are made to the Prisma/Postgres database so
migrations stay reversible, reviewable, and safe to run against a database
that already has real donation data in it post-launch.

## Before you start

Read `.agent/rules/architecture.md` for the current data model context and
`.agent/rules/security.md` for what donor data may/may not be stored.

## Workflow

1. Edit `prisma/schema.prisma` with the desired model change.
2. Generate a migration with a descriptive name:
   ```
   npx prisma migrate dev --name add_donation_recurring_flag
   ```
   Never use a generic name like `update` or `fix`.
3. Review the generated SQL in `prisma/migrations/<timestamp>_<name>/`
   before applying it — Prisma's diff is usually right but destructive
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
6. Run `npx prisma generate` so the Prisma client types stay in sync.

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

## Checklist before considering a migration "done"

- [ ] Descriptive migration name
- [ ] SQL reviewed for unintended drops/renames
- [ ] Destructive changes split into additive-then-cleanup steps if the
      table may already hold production data
- [ ] Corresponding `zod` schema + TS types updated
- [ ] `prisma generate` run
- [ ] No donor payment-instrument fields introduced (see `security.md`)
