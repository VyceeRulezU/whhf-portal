# Skill: Korapay Integration

## Purpose

Implement or modify the Korapay adapter at `lib/payments/korapay.ts`,
conforming to the shared `PaymentProvider` interface in
`.agent/rules/architecture.md`. Korapay is included as a secondary/fallback
route for NGN card, bank transfer, and mobile money — useful for redundancy
if Paystack/Flutterwave has an outage, and for its own settlement/rate
advantages if WHHF's finance team prefers it for specific flows. Confirm
with `PRD.md` before assuming Korapay is default for any particular donor
segment — treat it as provider #3, selected by `lib/payments/router.ts`,
not hardcoded into the UI.

## Before you start

Read `architecture.md` (payment abstraction section) and `security.md`
(payment integrity + secrets) in full.

## Keys & environment

```
KORAPAY_PUBLIC_KEY=      # client-safe, used for inline checkout if used
KORAPAY_SECRET_KEY=      # server-only, never exposed to client
KORAPAY_WEBHOOK_SECRET=  # used to verify webhook signatures
```

Add these (names only) to `.env.example`.

## Initialize a charge

`POST https://api.korapay.com/merchant/api/v1/charges/initialize` with
`Authorization: Bearer ${KORAPAY_SECRET_KEY}`.

Required fields: `reference` (our own, `whhf_<uuid>`, generated
server-side — never accept a client-supplied value), `amount` (confirm
current Korapay docs for unit convention before assuming kobo — providers
are inconsistent here, this is the #1 source of bugs when adding a new
provider), `currency`, `customer` (name/email), `redirect_url`. Create the
`Donation` row as `status: "pending"` keyed on `reference` before calling
Korapay.

## Verify a transaction (never skip this)

`GET https://api.korapay.com/merchant/api/v1/charges/{reference}`. Confirm
the returned status maps to success and that amount/currency match what we
initialized before marking the donation `succeeded`. As with the other two
providers, verify server-to-server regardless of whether you learned about
the completion via webhook or browser redirect.

## Webhook handling

Route: `app/api/webhooks/korapay/route.ts`.

1. Read the raw request body.
2. Compute the HMAC-SHA256 signature over the body using
   `KORAPAY_WEBHOOK_SECRET` and compare against the signature header Korapay
   sends (check current docs for the exact header name before implementing —
   don't guess).
3. Reject with `401` on mismatch; log the attempt without the full payload.
4. On a valid signature, call the verify endpoint above using the
   `reference` rather than trusting the webhook body's status/amount.
5. Update the `Donation` row keyed by `reference` — unique constraint makes
   repeat delivery a no-op.
6. Respond quickly; do side effects (receipt email) after responding.

## Checklist

- [ ] Secret key never sent to the client
- [ ] `reference` generated server-side, unique per attempt
- [ ] Confirmed the actual amount-unit convention in current Korapay docs
      before wiring — do not assume it matches Paystack's kobo convention
- [ ] Webhook signature verified before any processing
- [ ] Status/amount confirmed via the verify endpoint, not the webhook body
- [ ] Idempotent on repeat webhook delivery
- [ ] Provider selection logic lives in `lib/payments/router.ts`, not
      hardcoded in UI components
