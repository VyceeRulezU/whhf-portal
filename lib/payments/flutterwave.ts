import type {
  PaymentProvider,
  InitializeChargeInput,
  InitializeChargeResult,
  VerifyTransactionResult,
  WebhookEvent
} from "./types";

/**
 * Flutterwave adapter — see .agent/skills/flutterwave-integration/skill.md
 * before changing anything here. Primary route for international cards and
 * multi-currency donations.
 *
 * TODO: implement real API calls once FLUTTERWAVE_SECRET_KEY is available.
 * Confirm current amount-unit convention in Flutterwave's docs before
 * wiring — do not assume it matches Paystack's kobo convention.
 */
export const flutterwaveProvider: PaymentProvider = {
  name: "flutterwave",

  async initialize(input: InitializeChargeInput): Promise<InitializeChargeResult> {
    // POST https://api.flutterwave.com/v3/payments
    // Authorization: Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}
    throw new Error("flutterwaveProvider.initialize not yet implemented");
  },

  async verify(reference: string): Promise<VerifyTransactionResult> {
    // GET https://api.flutterwave.com/v3/transactions/{id}/verify
    throw new Error("flutterwaveProvider.verify not yet implemented");
  },

  parseWebhook(rawBody: string, signatureHeader: string | null): WebhookEvent | null {
    // Compare the `verif-hash` header against FLUTTERWAVE_WEBHOOK_SECRET_HASH.
    // Return null on any mismatch — see security.md.
    throw new Error("flutterwaveProvider.parseWebhook not yet implemented");
  }
};
