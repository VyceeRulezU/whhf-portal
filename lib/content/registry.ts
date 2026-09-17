/**
 * The single source of truth for what's family-editable across the site:
 * every page's editable fields, in the same order they render on the live
 * page (this order also drives the admin editor's layout — one array, two
 * uses). Every `default` is copied verbatim from what was hardcoded on
 * that page before it was wired up here, so a page renders identically
 * whether or not a DB row exists yet for any given field — see
 * lib/content/getPageContent.ts. See docs/production-readiness.md's CMS
 * section for the full design rationale (why one generic table+registry
 * instead of a table per content type).
 *
 * Deliberately excluded from this registry: Privacy/Terms pages (legal
 * text pending lawyer review) and site navigation links (a broken href
 * from a non-technical edit would break sitewide navigation) — per direct
 * confirmation, not an oversight.
 */

export interface TextFieldDef {
  type: "text";
  key: string;
  label: string;
  default: string;
  multiline?: boolean;
}

export interface ImageFieldDef {
  type: "image";
  key: string;
  label: string;
  default: string;
}

export interface ListFieldDef {
  type: "list";
  key: string;
  label: string;
  itemFields: (TextFieldDef | ImageFieldDef)[];
  default: Record<string, string>[];
}

export type FieldDef = TextFieldDef | ImageFieldDef | ListFieldDef;

export interface PageManifest {
  slug: string;
  label: string;
  sections: FieldDef[];
}

/**
 * Grows page by page as each is migrated (see docs/production-readiness.md
 * CMS rollout phases) — starts empty/skeleton, not all pages at once.
 */
export const contentRegistry: PageManifest[] = [];

export function getPageManifest(slug: string): PageManifest | undefined {
  return contentRegistry.find((page) => page.slug === slug);
}

/** Every field key declared across every page, flattened — used to validate an incoming save request references a real field. */
export function getAllFieldDefs(): Map<string, FieldDef> {
  const map = new Map<string, FieldDef>();
  for (const page of contentRegistry) {
    for (const field of page.sections) {
      map.set(field.key, field);
    }
  }
  return map;
}
