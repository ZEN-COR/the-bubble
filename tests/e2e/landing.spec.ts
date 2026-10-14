import { expect, test } from "@playwright/test";

test("landing page explains the product and links to sign-in", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Find people to study and meet with." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
});
