/**
 * Next.js instrumentation hook — loads the right Sentry init for
 * whichever runtime this code is executing in. See sentry.server.config.ts
 * for why the automatic onRequestError/captureRequestError hook (Sentry's
 * documented default here) is deliberately NOT exported from this file.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
