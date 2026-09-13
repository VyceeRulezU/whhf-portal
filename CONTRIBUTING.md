# Contributing

## Before opening a PR

1. Read `AGENTS.md` and the relevant files in `.agent/rules/` and
   `.agent/skills/` for the area you're touching.
2. Run `node tokens/generate-css-variables.js` if you touched any token
   file, and commit the regenerated `tokens.css` alongside.
3. Run the test suite; add tests for anything under `lib/payments/`,
   `lib/validation/`, or `app/api/`.

## Branch & commit conventions

- Branch names: `feat/<short-name>`, `fix/<short-name>`,
  `chore/<short-name>`.
- Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).

## PR checklist

- [ ] Follows `.agent/rules/code-style.md`
- [ ] No new colors/spacing outside `tokens/` (see `design-system.md`)
- [ ] No secrets committed; `.env.example` updated if a new variable was
      added
- [ ] If touching payments/webhooks/auth: PR description states what was
      manually tested, and which `.agent/skills/*-integration` checklist
      was followed
- [ ] Accessibility: keyboard nav + focus states checked for any new
      interactive UI

## Review priorities, in order

1. Money correctness and idempotency (payments, webhooks)
2. Donor data handling (PII minimization, no logging of sensitive fields)
3. Accessibility on donor-facing flows
4. Design system consistency
5. Everything else
