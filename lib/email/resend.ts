import { Resend } from "resend";

/**
 * Transactional email via Resend. See .env.example for the required
 * variables and where to get each one.
 */

function getClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  return new Resend(apiKey);
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailInput) {
  const from = process.env.RESEND_FROM_ADDRESS;
  if (!from) throw new Error("RESEND_FROM_ADDRESS is not set");

  const client = getClient();
  const result = await client.emails.send({ from, to, subject, html, replyTo });

  if (result.error) {
    throw new Error(`Resend error: ${result.error.message}`);
  }

  return result.data;
}
