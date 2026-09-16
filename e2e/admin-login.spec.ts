import { expect, test } from "@playwright/test";

// Needs an admin account already seeded — see e2e/README.md. Locally that's
// whatever you ran `npm run db:seed` with; CI seeds a known throwaway
// account into the ephemeral test database (see .github/workflows/ci.yml).
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;

test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, "E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set — see e2e/README.md");

test("admin can log in and reach the dashboard", async ({ page }) => {
  await page.goto("/admin/login");

  await page.getByLabel("Email", { exact: true }).fill(ADMIN_EMAIL!);
  await page.getByLabel("Password", { exact: true }).fill(ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});

test("wrong password shows an error and does not log in", async ({ page }) => {
  await page.goto("/admin/login");

  await page.getByLabel("Email", { exact: true }).fill(ADMIN_EMAIL!);
  await page.getByLabel("Password", { exact: true }).fill("definitely-the-wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/admin\/login$/);
});
