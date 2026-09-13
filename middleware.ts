import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Global security headers — see .agent/rules/security.md ("Infrastructure").
 * Runs on every request. Do not weaken CSP to work around a dev-only
 * problem; fix the underlying script/style source instead.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const isDev = process.env.NODE_ENV !== "production";

  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      // Payment providers' checkout widgets/redirects need their own
      // frame/script sources — add each provider's exact domain here as
      // it's wired in, never a wildcard.
      // 'unsafe-eval'/'unsafe-inline' are a dev-only concession: webpack's
      // dev-mode module runtime (React Refresh) both eval()s code and
      // injects literal inline <script> tags for the HMR/hydration
      // bootstrap. A strict script-src blocks these outright — not just
      // makes noisier, it silently breaks all client-side interactivity
      // (onClick, useEffect, forms) in `next dev`, with no visible error
      // short of a CSP violation logged to the browser console. Production
      // builds don't need either; never add them there.
      isDev ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'" : "script-src 'self'",
      "style-src 'self' 'unsafe-inline'", // CSS Modules inject inline <style> in dev; revisit for a stricter policy at build time
      "img-src 'self' data: https:",
      "frame-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'"
    ].join("; ")
  );
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  return res;
}

export const config = {
  // Run on everything except static assets/_next internals.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
