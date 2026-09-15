import { z } from "zod";

// Shared between the footer's NewsletterForm (client) and POST
// /api/newsletter/subscribe (server) — same split as lib/validation/contact.ts.
export const subscribeNewsletterSchema = z.object({
  email: z.string().email()
});

export const sendNewsletterSchema = z.object({
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(20000)
});
