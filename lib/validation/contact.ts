import { z } from "zod";

/**
 * Shared between the contact form (client) and POST /api/contact
 * (server) — same split as lib/validation/donation.ts.
 */
export const createContactMessageSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(20).optional(),
  subject: z.string().max(150).optional(),
  message: z.string().min(10).max(2000)
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;
