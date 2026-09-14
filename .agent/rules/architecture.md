# Architecture

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Server components by default; client components only where interactivity requires it |
| Language | TypeScript, strict mode | No `any` without a `// TODO(reason)` comment |
| Styling | Vanilla CSS | See `code-style.md` for methodology. No Tailwind, no CSS-in-JS |
| Database | PostgreSQL + Prisma ORM | See `db-migration-runner` skill for migrations |
| Auth | Admin-only auth (NextAuth or a minimal session-cookie system) | Public donors never need an account to give |
| Payments | Flutterwave, Paystack, Korapay | Each behind a common internal interface — see "Payment abstraction" below |
| Email | Transactional email provider (e.g. Resend/Postmark) for receipts | Not yet selected — flag if you need to pick one |
| Hosting | Cloudflare Workers, via `@opennextjs/cloudflare` | See `wrangler.jsonc` and README.md ("Deploying to Cloudflare Workers") |
| Storage | Cloudflare R2 (S3-compatible) | Site images, backups, general file storage — kept separate from Supabase's own storage quota. See `lib/storage/r2.ts` |

## Folder layout

```
/app
  /(marketing)          → public pages: home, about, programmes, impact, contact
  /(donate)             → donation flow: amount → details → payment → confirmation
  /admin                → authenticated dashboard for WHHF staff
  /api
    /donations          → create/verify donation records
    /webhooks
      /flutterwave
      /paystack
      /korapay
/components
  /ui                   → generic building blocks (Button, Card, Input, Badge…)
  /marketing            → page-specific sections
  /donate               → donation-flow-specific components
  /admin                → dashboard-specific components
/lib
  /payments             → one adapter file per provider + a shared interface
  /db                   → Prisma client singleton, query helpers
  /email
  /validation           → zod schemas shared by forms + API routes
/prisma
  schema.prisma
  /migrations
/styles
  /base                 → reset, typography, layout primitives
  /components           → one CSS file per component, colocated imports
/tokens                 → design tokens (source of truth — see design-system.md)
/public
/docs
```

## Data flow: a donation, end to end

1. Donor picks an amount/cause on `/donate` (client component; amount and
   currency held in local state).
2. On submit, the client calls `POST /api/donations` with donor details +
   intended amount/currency/cause — **no payment has happened yet**. This
   creates a `Donation` row with `status: "pending"`.
3. The API route asks the chosen provider adapter (`lib/payments/*`) to
   initialize a charge, and returns a redirect/checkout reference to the
   client.
4. Donor completes payment on the provider's hosted page or inline widget.
5. The provider calls our webhook (`/api/webhooks/{provider}`). The webhook
   handler verifies the signature, then verifies the transaction status by
   calling the provider's verify-transaction API directly (never trust the
   webhook payload's amount/status alone) before marking the `Donation` row
   `succeeded` or `failed`.
6. On success: fire a receipt email, increment the relevant campaign/cause
   total, and redirect the donor (if still on-page) to `/donate/thank-you`.

This flow must be idempotent — a webhook can be delivered more than once.
Key on the provider's transaction reference, not on time received.

## Payment abstraction

Every provider adapter in `lib/payments/` implements the same interface, e.g.:

```ts
interface PaymentProvider {
  initialize(input: InitializeInput): Promise<{ redirectUrl: string; reference: string }>;
  verify(reference: string): Promise<{ status: "success" | "failed" | "pending"; amountKobo: number; currency: string }>;
  handleWebhook(rawBody: string, signatureHeader: string): Promise<WebhookEvent | null>;
}
```

Route selection logic (which provider to default to) lives in one place —
`lib/payments/router.ts` — not scattered across UI code. Typical routing:
Paystack/Flutterwave for NGN + card, Flutterwave/Korapay for international and
mobile money, but confirm current provider coverage before hardcoding this.

## Admin dashboard

Minimum viable scope: list donations (filter by date/status/cause/provider),
export CSV, manage programme/cause pages' content, view aggregate totals for
reporting. Do not build a full CMS unless `PRD.md` asks for one.
