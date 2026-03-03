import { test, expect } from "@playwright/test";

test("homepage loads with expected content", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Create Next App");

  await expect(
    page.getByRole("heading", {
      name: /to get started, edit the page\.tsx file/i,
    })
  ).toBeVisible();

  const deployLink = page.getByRole("link", { name: /deploy now/i });
  const docsLink = page.getByRole("link", { name: /documentation/i });

  await expect(deployLink).toBeVisible();
  await expect(docsLink).toBeVisible();
});
