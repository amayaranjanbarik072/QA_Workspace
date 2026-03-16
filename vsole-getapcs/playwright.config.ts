import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: 1,
  timeout: 60000,
  reporter: [
    ["html", { outputFolder: "resources/reports/html" }],
    ["json", { outputFile: "resources/reports/results.json" }],
    ["list"]
  ],
  use: {
    headless: false,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});