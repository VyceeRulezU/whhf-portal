import { z } from "zod";

/**
 * Shared between the donation form (client) and POST /api/donations
 * (server) — see architecture.md data-flow section. This validates the
 * donor's *intent* before any payment provider is contacted; the actual
 * charged amount is always re-confirmed server-side against the provider's
 * verify-transaction response (see security.md).
 */
export const createDonationSchema = z.object({
  donor: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    // Required only above a compliance threshold — see docs/compliance-nigeria-ngo.md.
    // Left optional here until that threshold is confirmed by WHHF's legal adviser.
    phone: z.string().min(7).max(20).optional(),
    address: z.string().max(240).optional()
  }),
  amount: z.number().int().positive(), // smallest currency unit
  currency: z.enum(["NGN", "USD", "GBP"]),
  causeSlug: z.string().min(1),
  isRecurring: z.boolean().default(false),
  paymentMethod: z.enum(["card", "bank_transfer", "mobile_money"]),
  message: z.string().max(500).optional()
});

export type CreateDonationInput = z.infer<typeof createDonationSchema>;
