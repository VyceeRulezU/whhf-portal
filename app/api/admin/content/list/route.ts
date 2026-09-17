import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getSession } from "@/lib/auth/session";
import { withDb } from "@/lib/db/client";
import { siteContentFields } from "@/lib/db/schema";
import { getAllFieldDefs } from "@/lib/content/registry";
import { saveListSchema } from "@/lib/validation/content";

/**
 * Replaces a whole list field's items in one write — add/remove/reorder
 * all happen client-side against local state in the editor, one Save
 * persists the full array. Simplest correct semantics; avoids needing
 * separate add/remove/reorder endpoints or partial-update race conditions.
 */
export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = saveListSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "invalid_input", message: parsed.error.message } }, { status: 400 });
  }

  const { fieldKey, items } = parsed.data;
  const fieldDef = getAllFieldDefs().get(fieldKey);
  if (!fieldDef || fieldDef.type !== "list") {
    return NextResponse.json({ error: { code: "unknown_field" } }, { status: 400 });
  }

  const allowedKeys = new Set(fieldDef.itemFields.map((f) => f.key));
  const shapeOk = items.every((item) => Object.keys(item).every((k) => allowedKeys.has(k)));
  if (!shapeOk) {
    return NextResponse.json({ error: { code: "invalid_item_shape" } }, { status: 400 });
  }

  try {
    await withDb((db) =>
      db
        .insert(siteContentFields)
        .values({
          fieldKey,
          fieldType: "list",
          value: { items },
          updatedByAdminId: session.adminUserId
        })
        .onConflictDoUpdate({
          target: siteContentFields.fieldKey,
          set: { value: { items }, updatedAt: new Date(), updatedByAdminId: session.adminUserId }
        })
    );

    return NextResponse.json({ data: { ok: true } });
  } catch (err) {
    console.error("[api/admin/content/list] unexpected error", err);
    Sentry.captureException(err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong saving that list." } },
      { status: 500 }
    );
  }
}
