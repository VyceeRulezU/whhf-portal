# WHHF Portal

Public website + donation portal for the William & Helen Heritage
Foundation (WHHF), Abuja.

- **Product spec**: [`PRD.md`](./PRD.md)
- **Agent/engineering rules**: [`.agent/rules/`](./.agent/rules)
- **Task-specific patterns**: [`.agent/skills/`](./.agent/skills)
- **Design tokens**: [`tokens/`](./tokens)
- **Supporting docs**: [`docs/`](./docs)

If you're an AI coding agent, start at [`AGENTS.md`](./AGENTS.md), not here.

## Getting started (once the app is scaffolded)

```bash
npm install
cp .env.example .env.local   # fill in real values, never commit .env.local
node tokens/generate-css-variables.js   # regenerate tokens.css after any token edit
npx prisma migrate dev
npm run dev
```

## Repo structure

```
AGENTS.md              → start here if you're an AI agent
PRD.md                  → product requirements
.agent/
  rules/                → architecture, code-style, design-system, security
  skills/               → task-specific how-to's (API routes, components,
                           migrations, payment provider integrations)
tokens/                 → design tokens (JSON source + generated CSS)
docs/                   → compliance, roadmap, and other reference material
assets/brand/           → logo + favicon source files
app/, components/, lib/, prisma/, styles/, public/
                        → application code (created as the build progresses)
```

## Stack

Next.js (App Router) + TypeScript, vanilla CSS (CSS Modules, no framework),
PostgreSQL + Prisma, Flutterwave/Paystack/Korapay for payments. See
`.agent/rules/architecture.md` for the full picture.
