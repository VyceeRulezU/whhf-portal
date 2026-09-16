import * as Sentry from "@sentry/nextjs";

/**
 * Server-side (Node.js runtime) Sentry init — loaded from instrumentation.ts.
 * See docs/production-readiness.md Phase 2. Deliberately NOT wiring the
 * automatic onRequestError hook (Sentry.captureRequestError) here — that
 * specific integration has open GitHub issues causing AsyncLocalStorage
 * errors on Cloudflare Workers via @opennextjs/cloudflare (getsentry/
 * sentry-javascript#18842). app/error.tsx and app/global-error.tsx call
 * Sentry.captureException directly instead, which doesn't touch that
 * code path — verify with a real deploy before ever adding it back.
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1
});
