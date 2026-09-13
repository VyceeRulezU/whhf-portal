# Skill: Flutterwave Integration

## Purpose

Implement or modify the Flutterwave adapter at `lib/payments/flutterwave.ts`,
conforming to the shared `PaymentProvider` interface in
`.agent/rules/architecture.md`. Flutterwave is our primary route for
**international cards and multi-currency donations** (also supports NGN,
mobile money, and bank transfer).

## Before you start

Read `architecture.md` (payment abstraction section) and `security.md`
(payment integrity + secrets) in full.

## Keys & environment

```
FLUTTERWAVE_PUBLIC_KEY=      # client-safe, used in inline checkout if used
FLUTTERWAVE_SECRET_KEY=      # server-only, never exposed to client
FLUTTERWAVE_WEBHOOK_SECRET_HASH=   # "secret hash" configured in FLW dashboard, server-only
```

Add these (names only, no values) to `.env.example`.

## Initialize a charge

Use the **Standard Flow** (hosted payment page) unless the PRD specifies an
inline widget: `POST https://api.flutterwave.com/v3/payments` with
`Authorization: Bearer ${FLUTTERWAVE_SECRET_KEY}`.

Required fields: `tx_ref` (our own unique reference — generate as
`whhf_<uuid>`, don't let the client supply it), `amount` (major unit per
Flutterwave's convention — confirm in current API docs, this differs from
Paystack's kobo convention), `currency`, `redirect_url` (our
`/donate/callback` route), and `customer` (name/email). Store `tx_ref` on
the `Donation` row as `status: "pending"` before calling Flutterwave, so a
record exists even if the donor abandons checkout.

## Verify a transaction (never skip this)

After a webhook OR after the donor is redirected back to `/donate/callback`,
call `GET https://api.flutterwave.com/v3/transactions/{id}/verify` and
confirm:
- `status === "successful"`
- `amount` and `currency` match what we initialized (protects against a
  tampered redirect/webhook)

Only mark the `Donation` `succeeded` after this server-to-server check
passes — never on the client redirect or webhook payload alone.

## Webhook handling

Route: `app/api/webhooks/flutterwave/route.ts`.

1. Read the raw request body.
2. Compare the `verif-hash` header against `FLUTTERWAVE_WEBHOOK_SECRET_HASH`
   (this is a shared-secret header comparison for Flutterwave, not an HMAC
   of the body — confirm against current Flutterwave docs before assuming
   this hasn't changed).
3. If it doesn't match, return `401` and log the attempt (without logging
   the full payload).
4. If it matches, extract the `tx_ref`/transaction id and immediately call
   the **verify** endpoint above rather than trusting the webhook body's
   status/amount.
5. Update the `Donation` row keyed by `tx_ref` (unique constraint handles
   duplicate delivery — a second identical webhook should no-op).
6. Return `200` quickly; do heavier work (sending the receipt email) after
   responding, not before, so Flutterwave doesn't time out and retry
   unnecessarily.

## Checklist

- [ ] Secret key never sent to the client
- [ ] `tx_ref` generated server-side, unique per attempt
- [ ] Webhook signature/hash checked before any processing
- [ ] Status/amount confirmed via the verify endpoint, not the webhook body
- [ ] Idempotent on repeat webhook delivery
- [ ] Amounts stored as integers in the smallest unit internally, converted
      only at the Flutterwave API boundary if it expects major units
