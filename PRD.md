# Product Requirements Document — WHHF Portal

**Status:** Draft v1 — pending confirmation from WHHF board on open items marked ⚠️
**Owner:** Victor Ironali (NaliTech Consults) on behalf of William & Helen Heritage Foundation

## 1. Background

The William & Helen Heritage Foundation (WHHF) is an Abuja-based NGO
established in memory of Rev. (Mrs) Helen Titilayo Okoye (d. 2019), under
the umbrella of the All Christians Fellowship Mission (ACFM). Its
documented public activity centers on supporting indigent cancer patients
(e.g. a ₦1.5M distribution to five patients at National Hospital, Abuja,
tied to Mrs. Okoye's memorial anniversary). WHHF currently has no website.

## 2. Goals

1. Give WHHF a credible, dignified public presence that tells its founding
   story and programme work.
2. Let donors give easily and confidently — locally (NGN) and
   internationally (USD/GBP+) — via card, bank transfer, and mobile money.
3. Give WHHF staff a simple way to see what's come in, without needing a
   developer for every report.
4. Support WHHF's regulatory obligations (CAC, SCUML/AML) by keeping
   donation records complete and exportable from day one.

## 3. Non-goals (v1)

- No donor login/account system — donations are one-off or recurring via a
  saved payment method at the provider level, not a WHHF user account.
- No multi-language site (English only for v1).
- No native mobile app — responsive web only.
- No general CMS for arbitrary page layouts — content sections are
  structured (programmes, stories, team) rather than a free-form page
  builder, unless a future phase requires it.

## 4. Users

- **Donor** — individual in Nigeria or diaspora, wants to give quickly,
  wants to trust where the money goes, may want a tax receipt.
- **WHHF staff/board** — needs to view/export donations, update programme
  content and impact numbers, without engineering help for routine updates.
- **General visitor** — researching the foundation (press, partner orgs,
  potential major donors) before deciding to engage further.

## 5. Information architecture (public site)

- **Home** — mission statement, founding story teaser, live/rolling impact
  stat, primary donate CTA, featured programme, path to "Our Story."
- **Our Story** — Rev. (Mrs) Helen Okoye's legacy, how/why WHHF was formed,
  timeline.
- **Programmes** — cancer/indigent patient support as the flagship cause;
  space for additional programmes as WHHF confirms them.
- **Impact** — cumulative totals, notable distributions (e.g. the 2023
  National Hospital donation), beneficiary stories (with consent).
- **Leadership/Board** — board members and roles (already have: Vice
  Chairman, Programmes Manager, board members, Legal Adviser — confirm
  current full roster and bios with WHHF).
- **Get Involved** — donate, volunteer/partner inquiry, corporate
  partnership inquiry.
- **Contact** — address, phone, email, social links, physical office if
  applicable.
- **Donate** (flow, not a static page — see section 6).

## 6. Donation flow requirements

1. Donor selects: amount (preset options + custom), currency, cause/
   campaign (default: general fund), one-off vs. recurring (monthly).
2. Donor enters name, email, and (only if required by the amount/
   compliance threshold) phone/address.
3. Donor selects payment method: card, bank transfer, or mobile money;
   currency and method jointly determine which provider handles it (see
   `architecture.md` payment routing — e.g. NGN card/transfer via
   Paystack, international card via Flutterwave, Korapay as a fallback/
   alternate route).
4. Donor completes payment on the provider's page/widget.
5. Confirmation page shows the amount, cause, and a receipt is emailed
   immediately.
6. Recurring donations: the provider's subscription/tokenization feature
   handles renewal charges; WHHF admin can see and cancel a donor's
   recurring plan on request.

Acceptance criteria: a donor can complete a $10/₦5,000+ donation in under
90 seconds on mobile, with clear error recovery if a payment fails (retry
without re-entering all details).

## 7. Admin dashboard requirements

- Donation list: filter by date range, status, currency, provider, cause;
  CSV export.
- Aggregate view: total raised (all-time, this month, by cause), donor
  count, average gift size.
- Content management for: programme descriptions, impact numbers,
  leadership bios, featured stories — structured fields, not free-form
  HTML, to keep the design system intact.
- Manual donation entry (for offline/cash/cheque gifts WHHF wants recorded
  alongside online ones), clearly flagged as manually entered.
- Role: v1 can ship with a single admin role; flag if WHHF needs a
  restricted "content editor" role that can't see donor PII or export data.

## 8. Non-functional requirements

- **Performance**: public pages should be fast on mid-range Android over
  3G/4G (a realistic donor device profile in Nigeria) — optimize images,
  avoid heavy client JS on marketing pages.
- **Accessibility**: WCAG AA minimum across the public site and donation
  flow specifically (this is where excluding anyone costs the org real
  money).
- **Uptime**: donation flow and webhooks are the highest-priority
  components to keep available; a marketing-page outage is lower severity
  than a broken donate flow.
- **Compliance**: see `docs/compliance-nigeria-ngo.md`.

## 9. Success metrics

- Donation completion rate (started checkout → succeeded) — target to be
  set after baseline data exists; aim to benchmark against typical NGO
  checkout completion rates (~60-70%) once live.
- Time-to-first-donation after launch.
- % of donations that are recurring vs. one-off.
- Admin-reported time saved vs. current (manual/offline) reporting process.

## 10. Open questions for WHHF board / family (blocking full sign-off)

1. Full current board roster + short bios + headshots.
2. Confirmed CAC registration number and SCUML status, for the compliance
   footer/disclosures (see `docs/compliance-nigeria-ngo.md`).
3. ✅ Bank account details confirmed by WHHF and added to the Donate page
   (Fidelity Bank, account name "William and Helen Heritage Foundation",
   account 5600513265) — settlement currency/per-provider accounts still
   open once online payment providers are live.
4. Tax-receipt requirements — does WHHF issue any formal receipt donors can
   use for tax purposes, and does that require a specific document format?
5. WHHF's four confirmed programme areas (Value Promotion, Social and
   Community Development, Skills and Entrepreneurial Development, Holistic
   Development) are now on the Programmes page, from WHHF's own printed
   materials — which still leaves open which concrete NEW programmes
   beyond the cancer/indigent patient flagship should launch day one vs.
   be added later.
6. Any existing brand guidelines beyond the logo (approved photography,
   tone-of-voice examples) — currently working from the logo alone (see
   `design-system.md`).

## 11. Phasing (proposed)

- **Phase 1 (launch)**: marketing site (Home, Our Story, Programmes,
  Impact, Leadership, Contact) + donation flow (Paystack + Flutterwave) +
  minimal admin (donation list + CSV export).
  📌 See `docs/roadmap.md` for the phase-by-phase task breakdown.
- **Phase 2**: Korapay as third provider, recurring donations, richer admin
  content management, beneficiary story submissions.
- **Phase 3**: automated tax-receipt generation, donor-facing "my giving
  history" lookup (email-based, no login), multi-currency reporting
  dashboard.
