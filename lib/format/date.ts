// WHHF is based in Abuja, Nigeria (see CONTACT_ADDRESS in lib/email/templates.ts).
// Pinning locale + timeZone explicitly — rather than letting toLocaleDateString
// fall back to the runtime's own default — keeps these client components'
// server-rendered HTML and client hydration byte-for-byte identical
// regardless of the server process's or the admin's browser's own locale/
// timezone, which otherwise causes a React hydration mismatch.
const LOCALE = "en-NG";
const TIME_ZONE = "Africa/Lagos";

export function formatDate(date: Date): string {
  return date.toLocaleDateString(LOCALE, { timeZone: TIME_ZONE, year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString(LOCALE, {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
