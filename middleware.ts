import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Global security headers — see .agent/rules/security.md ("Infrastructure").
 * Runs on every request. Do not weaken CSP to work around a dev-only
 * problem; fix the underlying script/style source instead.
 */
export function middleware(_req: NextRequest) {
  const res = NextResponse.next();
  const isDev = process.env.NODE_ENV !== "production";

  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      // Payment providers' checkout widgets/redirects need their own
      // frame/script sources — add each provider's exact domain here as
      // it's wired in, never a wildcard.
      // 'unsafe-eval' is a dev-only concession: webpack's dev-mode module
      // runtime (React Refresh) eval()s code, which a strict script-src
      // blocks outright — silently breaking all client-side interactivity
      // in `next dev`, with no visible error short of a CSP console log.
      //
      // 'unsafe-inline' for scripts is NOT dev-only — Next.js's App Router
      // delivers the RSC/hydration payload via literal inline <script>
      // tags in production too, not just dev's HMR bootstrap. Without it,
      // production hydration fails outright (confirmed on the real
      // Cloudflare deployment: page loads, then goes blank, React throws
      // "Connection closed" mid-hydration).
      //
      // The fully-strict alternative is a per-request nonce (Next's
      // documented CSP pattern), but that requires every page reading
      // headers() to get the nonce, which forces ALL pages — including
      // the currently-static marketing pages — into dynamic per-request
      // rendering: a static page's nonce is fixed at build time and won't
      // match the fresh nonce this middleware would generate on each
      // later request. That's a real performance/architecture tradeoff
      // (losing static generation sitewide), not a drop-in hardening, so
      // it's deliberately not done here — revisit only if it's worth
      // that cost. In the meantime, this remains reasonably safe: React
      // escapes all rendered content by default (no dangerouslySetInnerHTML
      // anywhere in this codebase), so the residual risk 'unsafe-inline'
      // accepts is narrow.
      isDev ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'" : "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'", // CSS Modules inject inline <style> in dev; revisit for a stricter policy at build time
      "img-src 'self' data: https:",
      // WHHF's own Cloudflare R2 bucket — see lib/content/sitePhotos.ts and
      // siteVideos.ts. Scoped to that one domain, not a broad https: wildcard.
      "media-src 'self' https://pub-edb75a29dec547999359fcf854521a0f.r2.dev",
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
