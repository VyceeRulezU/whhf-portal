# Security Posture

High-level summary of the controls this app implements, kept intentionally
free of specifics that would double as an attacker's roadmap on a system
handling real donor payments. See `.agent/rules/security.md` for the
design principles this follows. A detailed, line-by-line gap tracker is
kept locally (not published) for ongoing engineering use.

## Implemented

- **Security headers** on every response — CSP, HSTS, X-Content-Type-Options,
  X-Frame-Options, Referrer-Policy, Permissions-Policy (`middleware.ts`).
- **Admin authentication** — signed, httpOnly, sameSite session cookies with
  a short expiry; passwords hashed with a salted, constant-time-compared
  scheme; generic error messages that never reveal whether an account
  exists.
- **Login rate limiting**, shared across all server instances (not just a
  single process).
- **Role-based access control** for admin actions that touch donor PII.
- **Fail-closed admin routes** — no valid session, no access, anywhere
  under the admin area.
- **Donor PII minimization** — personal data is shown only where the
  workflow genuinely needs it, and access to it is audit-logged.
- **Payment integrity pattern** — every payment webhook independently
  re-verifies with the provider rather than trusting the webhook payload,
  and confirmation pages re-verify rather than trusting redirect arrival
  as proof of success.
- **No secrets in client code** — provider keys and credentials are
  referenced only in server-side code; `.env.example` documents every
  variable name with no real values.
- **CI-enforced quality gates** — typecheck, lint, unit tests, and E2E
  tests run on every commit; error monitoring (Sentry) and a staging
  environment (isolated from production data) catch issues before they
  reach real donors.

## In progress

- Payment gateway integrations are being completed as provider
  credentials become available.
- Ongoing hardening as the donation flow moves toward handling real
  transactions — tracked internally, not itemized here.

Questions about current security posture for a partnership, audit, or
disclosure purpose: contact WHHF directly rather than relying solely on
this document.
