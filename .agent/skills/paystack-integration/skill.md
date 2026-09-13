# Skill: Paystack Integration

## Purpose

Implement or modify the Paystack adapter at `lib/payments/paystack.ts`,
conforming to the shared `PaymentProvider` interface in
`.agent/rules/architecture.md`. Paystack is our primary route for **NGN
card and bank-transfer donations from Nigerian donors**.

## Before you start

Read `architecture.md` (payment abstraction section) and `security.md`
(payment integrity + secrets) in full.

## Keys & environment

```
PAYSTACK_PUBLIC_KEY=     # client-safe, used for inline popup if used
PAYSTACK_SECRET_KEY=     # server-only, never exposed to client
```

Add these (names only) to `.env.example`. Paystack does not use a separate
webhook secret — webhook requests are authenticated via an HMAC of the raw
body using `PAYSTACK_SECRET_KEY` (see below).

## Initialize a transaction

`POST https://api.paystack.co/transaction/initialize` with
`Authorization: Bearer ${PAYSTACK_SECRET_KEY}`.

Required fields: `email`, `amount` (in **kobo** — Paystack's base unit is
always the smallest currency unit, which conveniently matches our internal
convention directly for NGN), `reference` (generate our own, `whhf_<uuid>`,
never accept a client-supplied reference), `callback_url`. Create the
`Donation` row as `status: "pending"` keyed on this `reference` before
calling Paystack.

## Verify a transaction (never skip this)

`GET https://api.paystack.co/transaction/verify/{reference}`. Confirm
`data.status === "success"` and `data.amount`/`data.currency` match what we
initialized before marking the donation `succeeded`. Do this both after
webhook receipt and after the donor's browser redirect back to
`/donate/callback` — whichever arrives, verify independently rather than
trusting either transport.

## Webhook handling

Route: `app/api/webhooks/paystack/route.ts`.

1. Read the **raw** request body (do not let a body-parsing middleware
   consume/reformat it first — the signature is computed over the exact raw
   bytes).
2. Compute `HMAC-SHA512(rawBody, PAYSTACK_SECRET_KEY)` and compare it
   (constant-time compare) against the `x-paystack-signature` header.
3. Reject with `401` if it doesn't match; log the attempt without the full
   payload.
4. On a valid signature, call the verify endpoint above using the
   `reference` from the event rather than trusting `event.data.status`
   directly.
5. Update the `Donation` row keyed by `reference` — unique constraint makes
   repeat delivery a no-op.
6. Respond `200` fast; send receipt email/side effects after responding.

## Checklist

- [ ] Secret key never sent to the client
- [ ] `reference` generated server-side, unique per attempt
- [ ] Webhook HMAC verified against the **raw** body before any processing
- [ ] Status/amount confirmed via the verify endpoint, not the webhook body
- [ ] Idempotent on repeat webhook delivery
- [ ] Amount stored/sent in kobo consistently — no float math
