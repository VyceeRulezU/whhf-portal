import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { adminLoginSchema } from "@/lib/validation/adminLogin";
import { withDb } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { isRateLimited, recordFailedAttempt, clearAttempts } from "@/lib/auth/rateLimit";

/**
 * See security.md ("Admin auth"): rate-limited, generic error message on
 * failure (never reveal whether the email exists), short-lived session on
 * success.
 */
export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "invalid_input", message: "Enter a valid email and password." } },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const rateLimitKey = `login:${email.toLowerCase()}`;

  if (await isRateLimited(rateLimitKey)) {
    return NextResponse.json(
      { error: { code: "rate_limited", message: "Too many attempts. Try again later." } },
      { status: 429 }
    );
  }

  const admin = await withDb((db) =>
    db.query.adminUsers.findFirst({ where: eq(adminUsers.email, email.toLowerCase()) })
  );
  const isValid = admin ? await verifyPassword(password, admin.passwordHash) : false;

  if (!admin || !isValid) {
    await recordFailedAttempt(rateLimitKey);
    // Generic message regardless of whether the email exists — don't leak which part was wrong.
    return NextResponse.json(
      { error: { code: "invalid_credentials", message: "Incorrect email or password." } },
      { status: 401 }
    );
  }

  await clearAttempts(rateLimitKey);
  await createSession({ adminUserId: admin.id, role: admin.role });

  return NextResponse.json({ data: { ok: true } }, { status: 200 });
}
