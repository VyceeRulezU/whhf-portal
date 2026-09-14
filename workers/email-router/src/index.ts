import PostalMime from "postal-mime";

export interface Env {
  APP_WEBHOOK_URL: string;
  INBOUND_EMAIL_WEBHOOK_SECRET: string;
}

/**
 * Cloudflare Email Worker — receives inbound email once Email Routing is
 * enabled for the whheritagefoundation.org zone and a routing rule (e.g.
 * "Catch-all address") points to this worker. See README.md for the
 * dashboard setup this depends on; nothing here activates on its own.
 *
 * This worker doesn't store anything itself — it parses the raw message
 * with postal-mime (Cloudflare's own recommended library for this) and
 * forwards the result to the main site's POST /api/webhooks/inbound-email,
 * which is the actual source of truth (same Postgres the rest of the
 * admin dashboard reads from).
 */
export default {
  async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
    const buffer = await new Response(message.raw).arrayBuffer();
    const parsed = await PostalMime.parse(buffer);

    const payload = {
      from: message.from,
      to: message.to,
      subject: parsed.subject,
      text: parsed.text,
      html: parsed.html
    };

    const res = await fetch(env.APP_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": env.INBOUND_EMAIL_WEBHOOK_SECRET
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.error(`[email-router] webhook forward failed: ${res.status} ${await res.text()}`);
    }
  }
};
