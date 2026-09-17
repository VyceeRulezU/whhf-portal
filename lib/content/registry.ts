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
export const contentRegistry: PageManifest[] = [
  {
    slug: "leadership",
    label: "Leadership",
    sections: [
      { type: "text", key: "leadership.hero.eyebrow", label: "Hero eyebrow", default: "Leadership" },
      { type: "text", key: "leadership.hero.title", label: "Hero title", default: "The people behind WHHF." },
      {
        type: "text",
        key: "leadership.hero.lede",
        label: "Hero subtitle",
        default: "Publicly reported board membership, pending confirmation of the current full roster and bios.",
        multiline: true
      },
      {
        type: "list",
        key: "leadership.board",
        label: "Board members",
        itemFields: [
          { type: "text", key: "name", label: "Name", default: "" },
          { type: "text", key: "role", label: "Role", default: "" },
          { type: "image", key: "photo", label: "Photo (optional — shows initials if left blank)", default: "" }
        ],
        default: [
          { name: "Engr. Titus Omolewa", role: "Vice Chairman", photo: "" },
          { name: "Joy Okoye", role: "Programmes Manager", photo: "" },
          { name: "Victor Okoye", role: "Board Member", photo: "" },
          { name: "Emma Okoye", role: "Board Member", photo: "" },
          {
            name: "Pauline Okoye",
            role: "Board Member",
            photo: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/paulineO.jpeg"
          },
          {
            name: "Sarah Okoye",
            role: "Board Member",
            photo: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/SarahO.jpeg"
          },
          { name: "Barr. Patrick Abah", role: "Legal Adviser", photo: "" }
        ]
      }
    ]
  },
  {
    slug: "contact",
    label: "Contact",
    sections: [
      { type: "text", key: "contact.hero.eyebrow", label: "Hero eyebrow", default: "Contact" },
      { type: "text", key: "contact.hero.title", label: "Hero title", default: "Get in touch." },
      {
        type: "text",
        key: "contact.hero.lede",
        label: "Hero subtitle",
        default: "Reach out about partnerships, volunteering, or general enquiries.",
        multiline: true
      },
      {
        // Also read directly by components/marketing/SiteFooter (via
        // getFieldValue, not this page's manifest) so the footer's contact
        // info can never drift out of sync with this page's — see
        // docs/production-readiness.md's CMS section.
        type: "list",
        key: "contact.rows",
        label: "Contact details",
        itemFields: [
          { type: "text", key: "label", label: "Label", default: "" },
          { type: "text", key: "value", label: "Value", default: "" }
        ],
        default: [
          {
            label: "Office address",
            value: "3FVM+H9M, Along Nile Street, Maitama, Abuja 904101, Federal Capital Territory"
          },
          { label: "Phone", value: "0806 432 0084" },
          { label: "Email", value: "contact@whheritagefoundation.org" }
        ]
      }
    ]
  }
];

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
