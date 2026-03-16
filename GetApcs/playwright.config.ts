import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./apps",
  globalSetup: "./global-setup.ts",
  fullyParallel: false,
  retries: 1,
  timeout: 60000,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["list"]
  ],
  use: {
    headless: false,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});