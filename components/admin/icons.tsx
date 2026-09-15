/**
 * Small inline icon set for the admin shell — plain stroke SVGs matching
 * the same visual language as the carousel/gallery arrows and Accordion
 * chevron elsewhere in the app, rather than pulling in an icon library.
 */

type IconProps = { className?: string };

export function DashboardIcon({ className }: IconProps) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function DonationsIcon({ className }: IconProps) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 15.5s-6-3.7-6-8.1C3 5 4.6 3 6.9 3c1.3 0 2.4.7 2.1 2 .3-1.3 1.4-2 2.7-2C13.9 3 15 5 15 7.4c0 4.4-6 8.1-6 8.1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EmailIcon({ className }: IconProps) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 4.75L9 10l6.5-5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDoubleLeftIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9.5 3L5 8l4.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 3L8.5 8l4.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SignOutIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M7 15.5H4a1.5 1.5 0 01-1.5-1.5V4A1.5 1.5 0 014 2.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 12.5L15.5 9l-4-3.5M15.5 9H6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
