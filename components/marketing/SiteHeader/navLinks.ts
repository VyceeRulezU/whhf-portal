/**
 * Plain data, deliberately kept out of SiteHeader.tsx (a "use client"
 * module) — a Server Component importing a non-component export from a
 * client module doesn't get the real value back, only a client reference.
 * Shared with the footer's "Explore" column — see app/(marketing)/layout.tsx.
 */
export const NAV_LINKS = [
  { href: "/about", label: "Our Story" },
  { href: "/programmes", label: "Programmes" },
  { href: "/impact", label: "Impact" },
  { href: "/leadership", label: "Leadership" },
  { href: "/contact", label: "Contact" }
];
