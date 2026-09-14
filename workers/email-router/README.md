# whhf-email-router

A separate, small Cloudflare Worker that receives real inbound email sent
to any `@whheritagefoundation.org` address (not just the `/contact` form
on the main site) and forwards it into the main app's database, where it
shows up in the admin dashboard.

It's a standalone Worker on purpose — Cloudflare's Email Routing feature
requires a Worker with an `email()` export, and the main site's Next.js
deployment (via `@opennextjs/cloudflare`) doesn't expose one. This worker
does the minimum: parse the raw message and hand it off to the main app's
`POST /api/webhooks/inbound-email`, which is the actual source of truth.

## What this does NOT do on its own

None of this activates just by deploying the worker. It depends on
Cloudflare account/DNS configuration that only the domain owner can do:

1. **The domain's nameservers must already be on Cloudflare.** Email
   Routing is a Cloudflare DNS-zone feature — if
   `whheritagefoundation.org` isn't using Cloudflare as its DNS provider,
   this whole approach doesn't apply and a different inbound-email
   provider would be needed instead.
2. **Enable Email Routing** for the zone: Cloudflare dashboard → the
   `whheritagefoundation.org` zone → Email → Email Routing → enable it.
   Cloudflare will ask to add/confirm the MX and SPF/DKIM-related DNS
   records it needs — it does this automatically since the zone is
   already on Cloudflare, but it still has to be confirmed once.
3. **Deploy this worker** (from this directory):
   ```
   cd workers/email-router
   npm install
   npx wrangler secret put INBOUND_EMAIL_WEBHOOK_SECRET
   # paste the SAME value as the main app's INBOUND_EMAIL_WEBHOOK_SECRET
   # (see the main project's .env.local / .env.example)
   ```
   Then set `APP_WEBHOOK_URL` in `wrangler.jsonc` to the main site's real
   production URL (e.g. `https://whheritagefoundation.org/api/webhooks/inbound-email`)
   before running:
   ```
   npx wrangler deploy
   ```
4. **Add a routing rule** in the dashboard: Email → Email Routing →
   Routing rules → either add a "Catch-all address" rule, or specific
   addresses (`contact@`, `info@`, etc.) — set the action to "Send to a
   Worker" and pick `whhf-email-router`.

Once all four are done, mail sent to the configured address(es) arrives
in the admin dashboard under **Inbox**.

## Local development

`npx wrangler dev` runs this worker locally, but Cloudflare Email Routing
itself can't be simulated locally — testing the full path means sending a
real email after the dashboard routing rule is live, or crafting a raw
RFC822 message and invoking `postal-mime` directly against it.
