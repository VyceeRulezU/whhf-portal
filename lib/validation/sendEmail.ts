import { z } from "zod";

// 8MB per attachment, matched against the base64 string length (~4/3 the
// raw byte size) — comfortably under Resend's 40MB-per-email cap while
// keeping a single admin-composed email reasonable.
const MAX_ATTACHMENT_BASE64_LENGTH = 8 * 1024 * 1024 * (4 / 3);

const attachmentSchema = z.object({
  filename: z.string().min(1).max(255),
  content: z.string().min(1).max(MAX_ATTACHMENT_BASE64_LENGTH)
});

export const sendEmailSchema = z.object({
  to: z.string().email(),
  cc: z.array(z.string().email()).max(10).optional(),
  bcc: z.array(z.string().email()).max(10).optional(),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(10000),
  inReplyToId: z.string().optional(),
  attachments: z.array(attachmentSchema).max(5).optional()
});
