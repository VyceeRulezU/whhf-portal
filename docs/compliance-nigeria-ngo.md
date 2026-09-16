# Nigeria NGO Compliance Reference

This doc tracks what's confirmed vs. outstanding for WHHF's regulatory
status, so the codebase (data model, disclosures, exports) is built to
support compliance rather than assuming a status that hasn't been verified.
This is a reference for engineering decisions, not legal advice — confirm
specifics with WHHF's legal adviser (Barr. Patrick Abah, per public
reporting) before publishing any compliance claim on the live site.

## Confirmed

- ⚠️ To fill in: CAC (Corporate Affairs Commission) registration
  number/date for WHHF as an incorporated trustee/NGO.
- ⚠️ To fill in: SCUML (Special Control Unit against Money Laundering)
  registration status. NGOs that receive and disburse public donations in
  Nigeria fall under SCUML's AML/CFT oversight for designated non-financial
  institutions; registration is generally required to legally operate bank
  accounts for such purposes.
- ✅ Bank account details for settlement — Fidelity Bank, account name
  "William and Helen Heritage Foundation", account 5600513265, now on the
  Donate page as a manual bank-transfer option alongside the payment
  providers being set up.

## What the codebase must support, regardless of exact filing status

- Every `Donation` record must retain: donor name, email, amount, currency,
  timestamp, payment method/provider, and provider transaction reference —
  sufficient to reconstruct a funds-received report on request.
- For donations above a threshold WHHF's legal adviser specifies, capture
  additional donor identification (phone/address) — implement this as a
  conditional field in the donation form once the threshold is confirmed,
  not hardcoded to a guessed number.
- Admin CSV export must be able to produce a plain "funds received" report
  (date, amount, currency, donor name, purpose/cause) suitable for handing
  to an auditor or regulator without engineering involvement.
- Public site footer should carry WHHF's registration number once
  confirmed (common practice for Nigerian NGOs to display this for donor
  trust) — leave a clearly-marked placeholder until then, don't fabricate a
  number.

## Action items (non-engineering)

- [ ] Obtain CAC registration certificate/number from WHHF board.
- [ ] Confirm SCUML registration status and certificate number.
- [ ] Confirm the donor-identification threshold with legal adviser.
- [ ] Confirm tax-receipt obligations (see `PRD.md` section 10, item 4).
