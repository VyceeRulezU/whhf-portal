import { defineConfig, devices } from "@playwright/test";

/**
 * Replaces the throwaway Playwright verification scripts written by hand
 * during development (see docs/production-readiness.md Phase 1) with a
 * small, permanent suite. Expects a server already running at baseURL —
 * see e2e/README.md for how to run these locally and how CI runs them
 * against an ephemeral database.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // `next dev` compiles routes on demand — two tests hitting the same
  // uncompiled route at once occasionally interact badly (confirmed:
  // passes every time alone or with --workers=1, only flakes under
  // parallel workers locally). CI runs a pre-built `next start`, which
  // has no on-demand compilation, so full parallelism there is safe.
  workers: process.env.CI ? undefined : 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry"
  },
  // Generous — `next dev` compiles each route on first hit, which can
  // take several seconds locally; CI runs against a pre-built `next
  // start`, so this headroom costs nothing there.
  expect: { timeout: 15000 },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
