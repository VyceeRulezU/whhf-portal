import { expect, test } from "@playwright/test";

test("submitting the contact form shows a success message", async ({ page }) => {
  await page.goto("/contact");

  await page.getByLabel("Full name", { exact: true }).fill("E2E Test User");
  await page.getByLabel("Email address", { exact: true }).fill(`e2e-${Date.now()}@example.com`);
  await page.getByLabel("Message", { exact: true }).fill("This is an automated end-to-end test submission.");

  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Thank you", { exact: false })).toBeVisible();
});
