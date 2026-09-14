import type { Metadata } from "next";

/**
 * Applies to the whole /admin subtree (login + protected dashboard) —
 * nothing here should ever be indexed. Belongs here rather than on
 * app/admin/login/page.tsx directly since that page is a Client Component
 * and can't export metadata itself. Defense-in-depth alongside the
 * disallow rule in app/robots.ts (that's a crawl hint; this is a stronger,
 * page-level signal search engines respect even via an external link).
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
