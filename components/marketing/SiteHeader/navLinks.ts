/**
 * Plain data, deliberately kept out of SiteHeader.tsx (a "use client"
 * module) — a Server Component importing a non-component export from a
 * client module doesn't get the real value back, only a client reference.
 *
 * NAV_LINKS renders as the header's direct desktop links (kept to a small,
 * scannable set); MORE_LINKS renders inside the "More" mega menu. The
 * mobile drawer and the footer's "Explore" column both use ALL_NAV_LINKS
 * so every page stays reachable regardless of screen size — see
 * app/(marketing)/layout.tsx.
 */
export const NAV_LINKS = [
  { href: "/about", label: "Our Story" },
  { href: "/programmes", label: "Programmes" },
  { href: "/impact", label: "Impact" }
];

export const MORE_LINKS = [
  { href: "/leadership", label: "Leadership", description: "Meet the board behind WHHF." },
  { href: "/blog", label: "Blog", description: "Stories, updates, and reflections." },
  { href: "/gallery", label: "Gallery", description: "Photos from our programmes." },
  { href: "/contact", label: "Contact", description: "Get in touch with our team." }
];

export const ALL_NAV_LINKS = [...NAV_LINKS, ...MORE_LINKS];
