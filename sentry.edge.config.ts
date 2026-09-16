import * as Sentry from "@sentry/nextjs";

/**
 * Edge-runtime Sentry init — Next.js always runs middleware.ts on the
 * edge runtime regardless of deployment target, so this covers errors
 * thrown there. See sentry.server.config.ts for why the automatic
 * onRequestError hook is deliberately not wired in.
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_APP_ENV || "production",
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1
});
