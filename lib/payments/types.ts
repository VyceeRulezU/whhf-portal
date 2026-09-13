/**
 * Every provider adapter in lib/payments/ implements this interface. See
 * architecture.md ("Payment abstraction") and the matching
 * .agent/skills/<provider>-integration/skill.md before implementing a
 * method body — each provider's real API details (amount units, webhook
 * signature scheme) differ and are documented there, not here.
 */

export interface InitializeChargeInput {
  reference: string; // generated server-side, e.g. `whhf_${uuid}`
  amountSmallestUnit: number;
  currency: string;
  customer: {
    name: string;
    email: string;
  };
  redirectUrl: string;
}

export interface InitializeChargeResult {
  redirectUrl: string;
  reference: string;
}

export type TransactionStatus = "success" | "failed" | "pending";

export interface VerifyTransactionResult {
  status: TransactionStatus;
  amountSmallestUnit: number;
  currency: string;
}

export interface WebhookEvent {
  reference: string;
  rawEventId: string;
}

export interface PaymentProvider {
  readonly name: "paystack" | "flutterwave" | "korapay";

  initialize(input: InitializeChargeInput): Promise<InitializeChargeResult>;

  verify(reference: string): Promise<VerifyTransactionResult>;

  /**
   * Verifies the webhook signature and extracts a reference to re-verify
   * server-to-server. Returns null if the signature is invalid — callers
   * must treat null as "reject the request", never fall back to trusting
   * the payload.
   */
  parseWebhook(rawBody: string, signatureHeader: string | null): WebhookEvent | null;
}
