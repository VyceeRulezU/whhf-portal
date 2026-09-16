# Build Roadmap

Expands `PRD.md` section 11 into a task-level checklist. Update checkboxes
as work lands; don't let this drift from what's actually shipped. See also
[`docs/production-readiness.md`](production-readiness.md) for the separate
hardening/ops track (CI, tests, monitoring, staging) — this file is
feature scope only.

## Phase 0 — Foundation (this scaffold)

- [x] Repo structure, `.agent` rules + skills
- [x] Design tokens (JSON source + generated `tokens.css`)
- [x] Next.js app initialized, Drizzle connected to a real Postgres instance
- [x] Base layout + typography/reset in `/styles/base`
- [x] `Button`, `Card`, `Badge`, `Input` components built to
      `design-system.md`

## Phase 1 — Launch

- [x] Marketing pages: Home, Our Story, Programmes, Impact, Leadership,
      Contact, Blog, Gallery, Faith
- [ ] Paystack adapter + webhook (NGN) — interface + router scaffolded,
      `initialize`/`verify`/`parseWebhook` still stubbed (throw "not yet
      implemented") — see `docs/security-status.md`
- [ ] Flutterwave adapter + webhook (international) — same stub status
- [x] Donation flow UI (amount → details → payment → confirmation)
- [x] Donation data model + admin donation list + CSV export
- [x] Receipt email on successful donation (wired into each webhook's
      success path — fires once a real payment provider goes live)
- [ ] Accessibility pass on donation flow specifically
- [ ] Compliance footer placeholder wired to `docs/compliance-nigeria-ngo.md`
      once WHHF confirms registration numbers (placeholder text is in
      place; real CAC/SCUML numbers are still pending from WHHF)

## Phase 1.5 — Admin & Communications Platform (built ahead of schedule)

Not originally scoped in this roadmap, but shipped alongside Phase 1:

- [x] Admin dashboard redesigned as a collapsible-sidebar CRM shell
- [x] Email platform: real inbound email + contact-form messages merged
      into one Inbox/Contact Form/Outgoing view, with reply, forward, and
      compose (Cc/Bcc, attachments), each backed by a branded HTML email
      template
- [x] Header notification bell/drawer (unread email, messages, recent
      donations; mark-as-read single and bulk)
- [x] Newsletter: footer signup form, public one-click unsubscribe,
      admin compose-and-send (one personalized email per subscriber, not
      a shared bcc list), subscriber management
- [x] Shared, column-driven admin `Table` component (Donations, dashboard
      Recent Donations, Newsletter Subscribers)
- [x] Supabase keep-alive scheduled workflow (prevents the free-tier
      project from pausing after inactivity)

## Phase 2 — Depth

- [ ] Korapay adapter + webhook (third provider / fallback) — stub status,
      same as Paystack/Flutterwave above
- [ ] Recurring donations (monthly) via provider subscription features
- [ ] Admin content management for programmes/impact/leadership (structured
      fields, not free-form HTML) — content is currently hardcoded in
      `lib/content/*.ts`, not admin-editable
- [ ] Beneficiary story submission + moderation flow

## Phase 3 — Maturity

- [ ] Automated tax-receipt document generation
- [ ] Donor-facing giving-history lookup (email-based, no account)
- [ ] Multi-currency reporting dashboard for the board
- [ ] Admin role separation (content editor vs. finance/full admin) — the
      `AdminUser.role` field exists in the schema but nothing currently
      enforces it; also tracked in `docs/production-readiness.md` Phase 5
