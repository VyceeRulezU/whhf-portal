# Security

This project handles real donor payments and PII. Treat every item below as
a hard rule, not a suggestion.

## Secrets & keys

- All payment provider secret keys, webhook signing secrets, and database
  credentials live in environment variables, never in source. Provide an
  `.env.example` with variable names and no real values.
- Public/client-safe keys (e.g. a provider's public checkout key) are the
  only kind allowed in client-side code — confirm which key is which before
  wiring it in; providers name these inconsistently.
- Never log secrets, full request bodies of webhook payloads, or raw
  card/account data, even in development logs.

## Payment integrity

- Never trust a webhook payload's amount or status at face value. On
  receiving a webhook: verify the signature per the skill's method, then
  call the provider's server-to-server "verify transaction" endpoint using
  the reference from the payload, and act on that response — not the
  webhook body.
- Webhooks must be idempotent. Store the provider transaction reference as a
  unique constraint on the `Donation`/`Transaction` table; a second delivery
  of the same event should no-op, not double-credit or double-email.
- Amounts are always integers in the smallest currency unit. A donation
  amount arriving from the client is treated as untrusted input — re-derive
  or clamp it server-side against whatever the donor actually confirmed at
  checkout initialization; don't let a webhook or client callback silently
  change the amount recorded.
- All payment-related API routes and webhook handlers run over HTTPS only
  and reject non-POST methods explicitly.

## Donor data (PII)

- Collect the minimum needed to process a donation and issue a receipt:
  name, email, amount, currency, cause, and (for compliance) address/phone
  only where legally required for large donations. Don't add fields "for
  later."
- Donor payment instrument details (card numbers, full bank account
  numbers) are never stored in our database — that data lives only with the
  payment provider. We store the provider's transaction reference and a
  masked/last-4 representation only if the provider gives us one.
- Any admin export of donor data must be behind authentication, and should
  log who exported what and when.
- If email marketing/newsletter opt-in is added later, it must be a
  separate explicit checkbox from the donation itself — never bundle
  consent.

## Admin auth

- Admin dashboard requires authentication; there is no "public preview"
  mode for donation data.
- Use short-lived sessions with secure, httpOnly, sameSite cookies.
- Rate-limit login attempts.
- Principle of least privilege if/when multiple admin roles exist (e.g. a
  content editor role should not be able to export donor PII or refund a
  transaction).

## Input validation

- Every API route validates its input with the shared `zod` schemas in
  `lib/validation/` before touching the database or calling a payment
  provider.
- Sanitize/escape any user-submitted content that gets rendered back (e.g.
  a "message with your donation" field) to prevent stored XSS.

## Infrastructure

- Enforce HTTPS everywhere; HSTS on.
- Set standard security headers (CSP, X-Content-Type-Options,
  Referrer-Policy) at the framework/hosting level.
- Dependency updates: don't pin payment SDK versions indefinitely — these
  libraries get security patches; check for updates on a regular cadence,
  not just at launch.

## Regulatory context (Nigeria)

WHHF, as an NGO soliciting and receiving public donations in Nigeria, sits
under both general CAC/CSO reporting obligations and — because it moves
donor funds — SCUML (Special Control Unit against Money Laundering)
registration expectations for AML purposes. This repo does not implement
compliance itself, but the data model must support it: every donation
record must be traceable (donor identity where required by
amount/threshold, timestamp, amount, currency, provider reference) so WHHF
can produce the reports SCUML/regulators may request. See
`docs/compliance-nigeria-ngo.md` for what's confirmed vs. still outstanding
— do not assume a compliance status ("we are SCUML-registered") that hasn't
been confirmed in that doc.
