import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { createInterestSubmissionSchema, interestCategoryLabel } from "@/lib/validation/interest";
import { withDb } from "@/lib/db/client";
import { interestSubmissions } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/resend";

/**
 * Public "interested in getting involved" form submission — see
 * app/(marketing)/interest. Always saves first (the durable record the
 * admin dashboard reads from); the notification email is a best-effort
 * convenience on top, same pattern as app/api/contact/route.ts.
 */
export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = createInterestSubmissionSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "invalid_input", message: parsed.error.message } },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const values = {
    ...input,
    otherDetails: input.category === "other" ? (input.otherDetails ?? null) : null
  };

  try {
    const [submission] = await withDb((db) => db.insert(interestSubmissions).values(values).returning());
    if (!submission) {
      throw new Error("insert returned no row");
    }

    const inbox = process.env.CONTACT_INBOX_EMAIL;
    if (inbox) {
      await sendEmail({
        to: inbox,
        replyTo: input.email,
        subject: "New interest form submission",
        html: `
          <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>
          <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
          <p><strong>Category:</strong> ${escapeHtml(interestCategoryLabel(input.category))}</p>
          ${values.otherDetails ? `<p><strong>Details:</strong> ${escapeHtml(values.otherDetails)}</p>` : ""}
        `
      }).catch((err) => {
        console.error("[api/interest] failed to send notification email", err);
        Sentry.captureException(err);
      });
    }

    return NextResponse.json({ data: { id: submission.id } }, { status: 201 });
  } catch (err) {
    console.error("[api/interest] unexpected error", err);
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
