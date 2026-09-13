import type {
  PaymentProvider,
  InitializeChargeInput,
  InitializeChargeResult,
  VerifyTransactionResult,
  WebhookEvent
} from "./types";

/**
 * Paystack adapter — see .agent/skills/paystack-integration/skill.md before
 * changing anything here. Handles NGN card + bank-transfer donations.
 *
 * TODO: implement real API calls once PAYSTACK_SECRET_KEY is available.
 * Amount unit: kobo (Paystack's base unit already matches our internal
 * smallest-unit convention for NGN).
 */
export const paystackProvider: PaymentProvider = {
  name: "paystack",

  async initialize(input: InitializeChargeInput): Promise<InitializeChargeResult> {
    // POST https://api.paystack.co/transaction/initialize
    // Authorization: Bearer ${process.env.PAYSTACK_SECRET_KEY}
    throw new Error("paystackProvider.initialize not yet implemented");
  },

  async verify(reference: string): Promise<VerifyTransactionResult> {
    // GET https://api.paystack.co/transaction/verify/${reference}
    throw new Error("paystackProvider.verify not yet implemented");
  },

  parseWebhook(rawBody: string, signatureHeader: string | null): WebhookEvent | null {
    // Compute HMAC-SHA512(rawBody, PAYSTACK_SECRET_KEY) and compare
    // (constant-time) against signatureHeader (`x-paystack-signature`).
    // Return null on any mismatch — see security.md, never trust unverified payloads.
    throw new Error("paystackProvider.parseWebhook not yet implemented");
  }
};
