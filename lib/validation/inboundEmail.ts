import { z } from "zod";

/**
 * Payload shape the workers/email-router Worker posts to
 * POST /api/webhooks/inbound-email after parsing a raw inbound message.
 */
export const inboundEmailSchema = z.object({
  from: z.string().min(3).max(320),
  to: z.string().min(3).max(320),
  subject: z.string().max(500).optional(),
  text: z.string().max(50000).optional(),
  html: z.string().max(100000).optional()
});

export type InboundEmailInput = z.infer<typeof inboundEmailSchema>;
