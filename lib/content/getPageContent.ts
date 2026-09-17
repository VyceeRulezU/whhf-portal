import { eq, like } from "drizzle-orm";
import { withDb } from "@/lib/db/client";
import { siteContentFields } from "@/lib/db/schema";
import { getPageManifest } from "./registry";

/**
 * Resolved content for one page: every field the manifest declares,
 * DB override applied where a row exists, manifest default otherwise (so
 * nothing breaks/goes blank before a field has ever been saved). Keyed by
 * the same dotted fieldKey used in the registry and in save requests.
 */
export async function getPageContent(slug: string): Promise<Record<string, unknown>> {
  const manifest = getPageManifest(slug);
  if (!manifest) return {};

  const rows = await withDb((db) =>
    db.query.siteContentFields.findMany({ where: like(siteContentFields.fieldKey, `${slug}.%`) })
  );
  const byKey = new Map(rows.map((row) => [row.fieldKey, row.value as { value?: string; items?: unknown[] }]));

  const result: Record<string, unknown> = {};
  for (const field of manifest.sections) {
    const stored = byKey.get(field.key);
    if (field.type === "list") {
      result[field.key] = stored?.items ?? field.default;
    } else {
      result[field.key] = stored?.value ?? field.default;
    }
  }
  return result;
}

/**
 * One-off lookup for a field shared outside its owning page's manifest
 * (e.g. SiteFooter reading "contact.rows", which belongs to the Contact
 * page's manifest) — a targeted query instead of loading a whole page's
 * worth of fields for one key.
 */
export async function getFieldValue<T>(key: string, fallback: T): Promise<T> {
  const row = await withDb((db) =>
    db.query.siteContentFields.findFirst({ where: eq(siteContentFields.fieldKey, key) })
  );
  if (!row) return fallback;
  const value = row.value as { value?: string; items?: unknown[] };
  return (value.items ?? value.value ?? fallback) as T;
}
