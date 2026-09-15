import { NextRequest, NextResponse } from "next/server";
import { subscribeNewsletterSchema } from "@/lib/validation/newsletter";
import { withDb } from "@/lib/db/client";
import { newsletterSubscribers } from "@/lib/db/schema";

/**
 * Public newsletter signup — see components/marketing/NewsletterForm. On
 * conflict (address already on file, active or previously unsubscribed),
 * re-activates the existing row rather than erroring, so re-subscribing
 * "just works" from the visitor's point of view.
 */
export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = subscribeNewsletterSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "invalid_input", message: parsed.error.message } },
      { status: 400 }
    );
  }

  const email = parsed.data.email.trim().toLowerCase();

  try {
    await withDb((db) =>
      db
        .insert(newsletterSubscribers)
        .values({ email })
        .onConflictDoUpdate({
          target: newsletterSubscribers.email,
          set: { isActive: true, unsubscribedAt: null }
        })
    );

    return NextResponse.json({ data: { subscribed: true } }, { status: 201 });
  } catch (err) {
    console.error("[api/newsletter/subscribe] unexpected error", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
