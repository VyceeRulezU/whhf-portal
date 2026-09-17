import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getSession } from "@/lib/auth/session";
import { uploadToR2, getPublicR2Url } from "@/lib/storage/r2";
import { getAllFieldDefs } from "@/lib/content/registry";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/validation/content";

/**
 * Uploads an image to R2 for a content field and returns its public URL.
 * Does NOT itself write to SiteContentField — the editor stages the
 * returned URL as the field's pending value, saved through the normal
 * PUT /field endpoint, same "upload, then explicit Save" flow as text.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  const fieldKey = formData?.get("fieldKey");

  if (!(file instanceof File) || typeof fieldKey !== "string") {
    return NextResponse.json({ error: { code: "invalid_input" } }, { status: 400 });
  }

  // Accepted for a scalar "image" field, or a "list" field whose items
  // include an image sub-field (e.g. a board member's photo) — the upload
  // itself doesn't need to know which item index it's for, the editor
  // just needs a URL back to stage locally before Save.
  const fieldDef = getAllFieldDefs().get(fieldKey);
  const isValidTarget =
    fieldDef?.type === "image" || (fieldDef?.type === "list" && fieldDef.itemFields.some((f) => f.type === "image"));
  if (!isValidTarget) {
    return NextResponse.json({ error: { code: "unknown_field" } }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json({ error: { code: "unsupported_type" } }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: { code: "file_too_large" } }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-").slice(-80);
  const key = `site-content/${fieldKey}/${crypto.randomUUID()}-${safeName}`;

  try {
    await uploadToR2(key, await file.arrayBuffer(), file.type);
    return NextResponse.json({ data: { url: getPublicR2Url(key) } });
  } catch (err) {
    console.error("[api/admin/content/upload] unexpected error", err);
    Sentry.captureException(err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong uploading that image." } },
      { status: 500 }
    );
  }
}
