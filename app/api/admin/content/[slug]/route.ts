import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getSession } from "@/lib/auth/session";
import { getPageManifest } from "@/lib/content/registry";
import { getPageContent } from "@/lib/content/getPageContent";

/**
 * Resolved content for one page's admin editor — manifest defaults merged
 * with any DB overrides. Gated on any authenticated admin session (not
 * isFullAdmin) since content editing is exactly what the "content_editor"
 * role exists for — see lib/auth/session.ts.
 */
export async function GET(_req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }

  const { slug } = await context.params;
  const manifest = getPageManifest(slug);
  if (!manifest) {
    return NextResponse.json({ error: { code: "not_found" } }, { status: 404 });
  }

  try {
    const values = await getPageContent(slug);
    return NextResponse.json({ data: { manifest, values } });
  } catch (err) {
    console.error("[api/admin/content/[slug]] unexpected error", err);
    Sentry.captureException(err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong loading that page's content." } },
      { status: 500 }
    );
  }
}
