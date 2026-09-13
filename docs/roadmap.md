# Build Roadmap

Expands `PRD.md` section 11 into a task-level checklist. Update checkboxes
as work lands; don't let this drift from what's actually shipped.

## Phase 0 — Foundation (this scaffold)

- [x] Repo structure, `.agent` rules + skills
- [x] Design tokens (JSON source + generated `tokens.css`)
- [ ] Next.js app initialized, Prisma connected to a real Postgres instance
- [ ] Base layout + typography/reset in `/styles/base`
- [ ] `Button`, `Card`, `Badge`, `Input` components built to
      `design-system.md`

## Phase 1 — Launch

- [ ] Marketing pages: Home, Our Story, Programmes, Impact, Leadership,
      Contact (content pending WHHF board input — see `PRD.md` §10)
- [ ] Donation flow UI (amount → details → payment → confirmation)
- [ ] Paystack adapter + webhook (NGN)
- [ ] Flutterwave adapter + webhook (international)
- [ ] Donation data model + admin donation list + CSV export
- [ ] Receipt email on successful donation
- [ ] Accessibility pass on donation flow specifically
- [ ] Compliance footer placeholder wired to `docs/compliance-nigeria-ngo.md`
      once WHHF confirms registration numbers

## Phase 2 — Depth

- [ ] Korapay adapter + webhook (third provider / fallback)
- [ ] Recurring donations (monthly) via provider subscription features
- [ ] Admin content management for programmes/impact/leadership (structured
      fields, not free-form HTML)
- [ ] Beneficiary story submission + moderation flow

## Phase 3 — Maturity

- [ ] Automated tax-receipt document generation
- [ ] Donor-facing giving-history lookup (email-based, no account)
- [ ] Multi-currency reporting dashboard for the board
- [ ] Admin role separation (content editor vs. finance/full admin)
