import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import styles from "./marketing-layout.module.css";

// SiteFooter reads family-editable content from the database (see
// lib/content/getPageContent.ts's getFieldValue, used for "contact.rows")
// on every render, since it's shared across every page in this layout.
// That forces every page here to be dynamically rendered — a build-time
// static-generation pass has no database to query against (confirmed:
// build fails with ECONNREFUSED against CI's intentionally-fake
// DATABASE_URL otherwise). Setting it once here, at the layout, covers
// every current and future page under (marketing) without needing a
// per-page `export const dynamic` — see docs/production-readiness.md's
// CMS section for the full rationale.
export const dynamic = "force-dynamic";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className={`visually-hidden ${styles.skipLink}`}>
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}
