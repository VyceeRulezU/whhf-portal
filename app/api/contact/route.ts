import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { createContactMessageSchema } from "@/lib/validation/contact";
import { withDb } from "@/lib/db/client";
import { contactMessages } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/resend";

/**
 * Public contact form submission. Always saves the message first (the
 * durable record the admin dashboard reads from) — the notification email
 * is a best-effort convenience on top, not the source of truth, so a
 * Resend outage never loses a message. See .agent/skills/api-route-scaffolder/skill.md.
 */
export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = createContactMessageSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "invalid_input", message: parsed.error.message } },
      { status: 400 }
    );
  }

  const input = parsed.data;

  try {
    const [contactMessage] = await withDb((db) => db.insert(contactMessages).values(input).returning());
    if (!contactMessage) {
      throw new Error("insert returned no row");
    }

    const inbox = process.env.CONTACT_INBOX_EMAIL;
    if (inbox) {
      await sendEmail({
        to: inbox,
        replyTo: input.email,
        subject: input.subject ? `Contact form: ${input.subject}` : "New contact form message",
        html: `
          <p><strong>From:</strong> ${escapeHtml(input.name)} (${escapeHtml(input.email)})</p>
          ${input.phone ? `<p><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>` : ""}
          <p>${escapeHtml(input.message).replace(/\n/g, "<br>")}</p>
        `
      }).catch((err) => {
        console.error("[api/contact] failed to send notification email", err);
        Sentry.captureException(err);
      });
    }

    return NextResponse.json({ data: { id: contactMessage.id } }, { status: 201 });
  } catch (err) {
    console.error("[api/contact] unexpected error", err);
    Sentry.captureException(err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong." } },
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
