import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getSession } from "@/lib/auth/session";
import { withDb } from "@/lib/db/client";
import { sentEmails } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/resend";
import { adminMessageTemplate } from "@/lib/email/templates";
import { sendEmailSchema } from "@/lib/validation/sendEmail";

/**
 * Admin-initiated outgoing email — either a reply to a ContactMessage/
 * InboundEmail (inReplyToId set) or a fresh compose. Sends via Resend,
 * then records the send in SentEmail regardless of the caller's original
 * channel, since that's the durable "Outgoing" record the Email page's
 * Outgoing tab reads from.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = sendEmailSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "invalid_input", message: parsed.error.message } },
      { status: 400 }
    );
  }

  const { to, cc, bcc, subject, body, inReplyToId, attachments } = parsed.data;
  const fromAddress = process.env.RESEND_FROM_ADDRESS;

  if (!fromAddress) {
    return NextResponse.json({ error: { code: "not_configured" } }, { status: 500 });
  }

  try {
    await sendEmail({
      to,
      cc,
      bcc,
      subject,
      html: adminMessageTemplate(escapeHtml(body).replace(/\n/g, "<br>")),
      attachments
    });

    const [sent] = await withDb((db) =>
      db
        .insert(sentEmails)
        .values({
          toAddress: to,
          fromAddress,
          subject,
          body,
          inReplyToId,
          ccAddresses: cc && cc.length > 0 ? cc.join(", ") : null,
          bccAddresses: bcc && bcc.length > 0 ? bcc.join(", ") : null,
          attachmentNames: attachments && attachments.length > 0 ? attachments.map((a) => a.filename).join(", ") : null,
          sentByAdminId: session.adminUserId
        })
        .returning()
    );
    if (!sent) {
      throw new Error("insert returned no row");
    }

    return NextResponse.json({ data: { id: sent.id } }, { status: 201 });
  } catch (err) {
    console.error("[api/admin/email/send] unexpected error", err);
    Sentry.captureException(err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong sending that email." } },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
