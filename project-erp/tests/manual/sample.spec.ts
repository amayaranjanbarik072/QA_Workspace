import { test, expect } from "@playwright/test";

test.describe("Sample Test", () => {
  test("should open google and verify title", async ({ page }) => {
    await page.goto("https://www.google.com");
    await expect(page).toHaveTitle(/Google/);
    console.log("✅ Google opened successfully!");
  });
});