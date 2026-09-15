import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { withDb } from "@/lib/db/client";
import { newsletterSubscribers, sentNewsletters } from "@/lib/db/schema";
import { sendBatchEmails } from "@/lib/email/resend";
import { newsletterTemplate } from "@/lib/email/templates";
import { sendNewsletterSchema } from "@/lib/validation/newsletter";

const SITE_URL = "https://whheritagefoundation.org";
// Resend's batch endpoint caps out at 100 emails per call — see
// sendBatchEmails in lib/email/resend.ts.
const BATCH_SIZE = 100;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Admin-triggered newsletter blast — see app/admin/(protected)/newsletter.
 * Sent one email per active subscriber (via Resend's batch endpoint, not
 * a shared bcc list) so each copy's unsubscribe link is personalized to
 * that subscriber's own address.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = sendNewsletterSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "invalid_input", message: parsed.error.message } },
      { status: 400 }
    );
  }

  const { subject, body } = parsed.data;
  const bodyHtmlWithBreaks = escapeHtml(body).replace(/\n/g, "<br>");

  try {
    const subscribers = await withDb((db) =>
      db.query.newsletterSubscribers.findMany({ where: eq(newsletterSubscribers.isActive, true) })
    );

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: { code: "no_subscribers", message: "There are no active subscribers to send to." } },
        { status: 400 }
      );
    }

    const emails = subscribers.map((subscriber) => ({
      to: subscriber.email,
      subject,
      html: newsletterTemplate({
        subject,
        bodyHtmlWithBreaks,
        unsubscribeHref: `${SITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`
      })
    }));

    for (const batch of chunk(emails, BATCH_SIZE)) {
      await sendBatchEmails(batch);
    }

    const [record] = await withDb((db) =>
      db
        .insert(sentNewsletters)
        .values({ subject, body, recipientCount: subscribers.length, sentByAdminId: session.adminUserId })
        .returning()
    );
    if (!record) {
      throw new Error("insert returned no row");
    }

    return NextResponse.json({ data: { id: record.id, recipientCount: subscribers.length } }, { status: 201 });
  } catch (err) {
    console.error("[api/admin/newsletter/send] unexpected error", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong sending that newsletter." } },
      { status: 500 }
    );
  }
}
