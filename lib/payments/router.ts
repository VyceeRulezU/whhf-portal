import type { PaymentProvider } from "./types";
import { paystackProvider } from "./paystack";
import { flutterwaveProvider } from "./flutterwave";
import { korapayProvider } from "./korapay";

/**
 * Centralized provider selection — see architecture.md ("Payment
 * abstraction"). UI components ask for a provider through this function;
 * they never import a specific adapter directly, so routing rules can
 * change in one place.
 *
 * Placeholder routing (confirm with PRD.md before launch):
 * - NGN + card or bank_transfer  -> Paystack
 * - Any other currency, or mobile_money -> Flutterwave
 * - Korapay is available as an explicit fallback, not yet a default route
 */
export function selectProvider(input: {
  currency: string;
  paymentMethod: "card" | "bank_transfer" | "mobile_money";
}): PaymentProvider {
  if (input.currency === "NGN" && input.paymentMethod !== "mobile_money") {
    return paystackProvider;
  }
  return flutterwaveProvider;
}

export const providers = {
  paystack: paystackProvider,
  flutterwave: flutterwaveProvider,
  korapay: korapayProvider
} as const;
