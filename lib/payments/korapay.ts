import type {
  PaymentProvider,
  InitializeChargeInput,
  InitializeChargeResult,
  VerifyTransactionResult,
  WebhookEvent
} from "./types";

/**
 * Korapay adapter — see .agent/skills/korapay-integration/skill.md before
 * changing anything here. Secondary/fallback route for NGN card, bank
 * transfer, and mobile money.
 *
 * TODO: implement real API calls once KORAPAY_SECRET_KEY is available.
 * Confirm current amount-unit convention in Korapay's docs before wiring —
 * this is the most common source of bugs when adding a new provider.
 */
export const korapayProvider: PaymentProvider = {
  name: "korapay",

  async initialize(input: InitializeChargeInput): Promise<InitializeChargeResult> {
    // POST https://api.korapay.com/merchant/api/v1/charges/initialize
    // Authorization: Bearer ${process.env.KORAPAY_SECRET_KEY}
    throw new Error("korapayProvider.initialize not yet implemented");
  },

  async verify(reference: string): Promise<VerifyTransactionResult> {
    // GET https://api.korapay.com/merchant/api/v1/charges/{reference}
    throw new Error("korapayProvider.verify not yet implemented");
  },

  parseWebhook(rawBody: string, signatureHeader: string | null): WebhookEvent | null {
    // Compute HMAC-SHA256(rawBody, KORAPAY_WEBHOOK_SECRET) and compare
    // against the signature header — confirm exact header name in current
    // Korapay docs before assuming. Return null on any mismatch.
    throw new Error("korapayProvider.parseWebhook not yet implemented");
  }
};
