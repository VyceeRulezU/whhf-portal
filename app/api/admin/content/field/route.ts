import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getSession } from "@/lib/auth/session";
import { withDb } from "@/lib/db/client";
import { siteContentFields } from "@/lib/db/schema";
import { getAllFieldDefs } from "@/lib/content/registry";
import { saveFieldSchema } from "@/lib/validation/content";

/**
 * Saves one scalar text/image field. Rejects any fieldKey not declared in
 * the registry — the registry, not this request, is the source of truth
 * for what's editable, so a forged/typo'd key can never create a stray
 * row. See lib/content/registry.ts.
 */
export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = saveFieldSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "invalid_input", message: parsed.error.message } }, { status: 400 });
  }

  const { fieldKey, value } = parsed.data;
  const fieldDef = getAllFieldDefs().get(fieldKey);
  if (!fieldDef || fieldDef.type === "list") {
    return NextResponse.json({ error: { code: "unknown_field" } }, { status: 400 });
  }

  try {
    await withDb((db) =>
      db
        .insert(siteContentFields)
        .values({
          fieldKey,
          fieldType: fieldDef.type,
          value: { value },
          updatedByAdminId: session.adminUserId
        })
        .onConflictDoUpdate({
          target: siteContentFields.fieldKey,
          set: { value: { value }, updatedAt: new Date(), updatedByAdminId: session.adminUserId }
        })
    );

    return NextResponse.json({ data: { ok: true } });
  } catch (err) {
    console.error("[api/admin/content/field] unexpected error", err);
    Sentry.captureException(err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong saving that field." } },
      { status: 500 }
    );
  }
}
