import * as Sentry from "@sentry/nextjs";

/**
 * Browser-side Sentry init — see docs/production-readiness.md Phase 2.
 * NEXT_PUBLIC_SENTRY_DSN is inlined into the client bundle at build time
 * (standard Next.js behavior for NEXT_PUBLIC_* vars), so it must be set
 * in the environment `npm run cf:build` runs in, not just as a runtime
 * secret. A DSN is not a secret — Sentry's own design intentionally
 * allows it to ship in a public bundle. Sentry.init() is a documented
 * no-op when the DSN is unset (local dev without it, CI), so this never
 * throws.
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
