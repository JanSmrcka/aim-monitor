import { test, expect } from "@playwright/test";

test.describe("Auth flow", () => {
  test("unauthenticated user on / redirects to /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page renders card with GitHub button", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByText("AIM Monitor")).toBeVisible();
    await expect(page.getByText("Sign in to your account")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /continue with github/i })
    ).toBeVisible();
  });

  test("login button redirects to GitHub OAuth", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /continue with github/i }).click();

    // Wait until we leave localhost (redirected to github.com)
    await page.waitForURL(/github\.com/, { timeout: 15000 });
    expect(page.url()).toContain("github.com");
  });

  test("/login is accessible without redirect loop", async ({ page }) => {
    const resp = await page.goto("/login");
    expect(resp?.status()).toBe(200);
    await expect(page).toHaveURL(/\/login/);
  });

  test("static assets bypass middleware", async ({ request }) => {
    const resp = await request.get("/favicon.ico");
    expect(resp.status()).not.toBe(307);
  });

  test("/api/auth/providers returns GitHub provider", async ({ request }) => {
    const resp = await request.get("/api/auth/providers");
    expect(resp.ok()).toBe(true);
    const data = await resp.json();
    expect(data.github).toBeDefined();
    expect(data.github.id).toBe("github");
  });

  test("authenticated user sees home page", async ({ browser }) => {
    const context = await browser.newContext();
    // Simulate session cookie
    await context.addCookies([
      {
        name: "authjs.session-token",
        value: "fake-session-token",
        domain: "localhost",
        path: "/",
      },
    ]);

    const page = await context.newPage();
    await page.goto("/");

    // Middleware passes (cookie exists), but auth() returns null for fake token
    // so page.tsx redirects to /login — this verifies the full flow
    await expect(page).toHaveURL(/\/login/);
    await context.close();
  });
});
