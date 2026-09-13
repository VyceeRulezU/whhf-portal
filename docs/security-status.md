# Security — Implementation Status

Tracks what `.agent/rules/security.md` requires against what's actually
wired up in this scaffold, so nothing is assumed "done" that's really just
documented intent. Update this as real implementation lands.

## Implemented in this scaffold

- **Security headers** — `middleware.ts` sets CSP, X-Content-Type-Options,
  X-Frame-Options, Referrer-Policy, Permissions-Policy, and HSTS on every
  response. The CSP's `script-src`/`connect-src` will need each payment
  provider's exact domains added as their checkout widgets are wired in —
  see the inline comment in `middleware.ts`.
- **Admin auth** — signed, httpOnly, sameSite=strict session cookie
  (`lib/auth/session.ts`), 8-hour expiry, HMAC-signed with `AUTH_SECRET`.
  Passwords hashed with scrypt + per-user salt, constant-time compare
  (`lib/auth/password.ts`) — never stored or logged in plaintext.
- **Login rate limiting** — in-memory limiter (`lib/auth/rateLimit.ts`),
  5 attempts / 15 minutes per email. Documented as in-memory-only; needs a
  shared store before running multiple server instances.
- **Fail-closed admin routes** — `app/admin/(protected)/layout.tsx` redirects
  to `/admin/login` with no session; `/admin/login` itself lives outside
  that route group so it isn't gated behind the check it creates.
- **Generic auth error messages** — the login route never reveals whether
  an email exists, only "Incorrect email or password."
- **Donor PII minimization in the UI** — the admin donation list shows
  donor name but not email; email only appears in the audited CSV export.
- **Audited export** — `GET /api/admin/donations/export` checks the
  session independently of the page-level guard (API routes are reachable
  directly) and logs `adminUserId`, row count, and timestamp before
  streaming the CSV.
- **Payment integrity pattern** — every webhook route (`app/api/webhooks/*`)
  follows verify-signature → re-verify-via-provider-API → idempotent update,
  never trusting the webhook payload's amount/status directly. The
  `/donate/callback` page re-verifies too rather than trusting arrival at
  the redirect URL as proof of success.
- **No secrets in the client** — all provider secret keys are referenced
  only in server-side files (`lib/payments/*`, API routes); `.env.example`
  documents every variable name with no real values.
- **Bootstrap admin creation without a hardcoded password** —
  `prisma/seed.ts` only creates an admin user if `SEED_ADMIN_EMAIL` /
  `SEED_ADMIN_PASSWORD` are explicitly set in the environment.

## Deliberately stubbed / still needs real implementation

- The three payment adapters' `initialize`/`verify`/`parseWebhook` methods
  throw `"not yet implemented"` — real HTTP calls and signature schemes
  need to be filled in per each `.agent/skills/*-integration/skill.md` once
  API keys exist.
- No admin role separation yet (`AdminUser.role` field exists but every
  role currently gets full access) — see `security.md` ("principle of
  least privilege") and `PRD.md` §7 for when this becomes necessary.
- Rate limiting is in-memory only (see above) — fine for a single instance,
  not for multi-instance/production scale without a shared store.
- CSP is a reasonable starting policy but not yet tightened against a real
  build (e.g. `style-src 'unsafe-inline'` is a dev-mode concession for CSS
  Modules' injected `<style>` tags — revisit once the production build
  pipeline is finalized).
- No automated tests yet for the auth/session/rate-limit code — add these
  before relying on this in production, per `code-style.md` ("chase
  coverage on anything that touches money or donor PII").
- SCUML/CAC compliance fields and thresholds are placeholders — see
  `docs/compliance-nigeria-ngo.md`.
