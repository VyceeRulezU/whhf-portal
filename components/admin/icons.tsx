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

export function NewsletterIcon({ className }: IconProps) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2.5 6.5L9 3l6.5 3.5v6a1.5 1.5 0 01-1.5 1.5h-10A1.5 1.5 0 012.5 12.5v-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M5.5 8h7M5.5 10.5h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function BellIcon({ className }: IconProps) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 2.5c-2.2 0-4 1.8-4 4v2.4c0 .5-.2 1-.5 1.4L3.5 11.6c-.5.6-.1 1.4.6 1.4h9.8c.7 0 1.1-.8.6-1.4l-1-1.3c-.3-.4-.5-.9-.5-1.4V6.5c0-2.2-1.8-4-4-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7.2 15a1.8 1.8 0 003.6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path
        d="M1.5 9S4.5 3.5 9 3.5 16.5 9 16.5 9 13.5 14.5 9 14.5 1.5 9 1.5 9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ReplyIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M8 5L3 9l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9h7a4.5 4.5 0 014.5 4.5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ForwardIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M10 5l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 9H8a4.5 4.5 0 00-4.5 4.5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M3.5 9.5L7 13l7.5-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M3 5h12M7 5V3.5A1.5 1.5 0 018.5 2h1A1.5 1.5 0 0111 3.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 5l.6 8.4A1.5 1.5 0 006.6 15h4.8a1.5 1.5 0 001.5-1.6L13.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.3 8v4M10.7 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

export function PagesIcon({ className }: IconProps) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M5 2.5h6l3 3v10a1 1 0 01-1 1H5a1 1 0 01-1-1v-12a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M11 2.5V6h3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 9.5h6M6 12.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
