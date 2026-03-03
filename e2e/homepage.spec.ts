import { test, expect } from "@playwright/test";

test("homepage redirects unauthenticated user to login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText("AIM Monitor")).toBeVisible();
});
