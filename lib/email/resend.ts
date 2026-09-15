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

interface EmailAttachment {
  filename: string;
  /** Base64-encoded file content — see components/admin/ComposeEmailModal, which reads the file client-side via FileReader before sending. */
  content: string;
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: EmailAttachment[];
}

export async function sendEmail({ to, subject, html, replyTo, cc, bcc, attachments }: SendEmailInput) {
  const from = process.env.RESEND_FROM_ADDRESS;
  if (!from) throw new Error("RESEND_FROM_ADDRESS is not set");

  const client = getClient();
  const result = await client.emails.send({ from, to, subject, html, replyTo, cc, bcc, attachments });

  if (result.error) {
    throw new Error(`Resend error: ${result.error.message}`);
  }

  return result.data;
}

interface BatchEmailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends many distinct emails (e.g. a newsletter run, one per subscriber so
 * each copy's unsubscribe link is personalized — see
 * lib/email/templates.ts's newsletterTemplate) as ONE Resend API call
 * instead of one request per recipient, which would blow through Resend's
 * per-second rate limit for any list beyond a handful of subscribers.
 * Resend's batch endpoint caps out at 100 emails per call, so callers are
 * responsible for chunking a larger list themselves.
 */
export async function sendBatchEmails(emails: BatchEmailInput[]) {
  const from = process.env.RESEND_FROM_ADDRESS;
  if (!from) throw new Error("RESEND_FROM_ADDRESS is not set");

  const client = getClient();
  const result = await client.batch.send(emails.map((email) => ({ from, ...email })));

  if (result.error) {
    throw new Error(`Resend error: ${result.error.message}`);
  }

  return result.data;
}
