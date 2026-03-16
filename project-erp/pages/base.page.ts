import { Page, Locator } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: "networkidle" });
  }

  async clickButton(text: string) {
    await this.page.getByRole("button", { name: text }).click();
  }

  async fillField(label: string, value: string) {
    await this.page.getByLabel(label).fill(value);
  }

  async selectOption(label: string, value: string) {
    await this.page.getByLabel(label).selectOption(value);
  }

  async waitForText(text: string) {
    await this.page.getByText(text).waitFor({ state: "visible" });
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `resources/reports/${name}.png`,
      fullPage: true,
    });
  }
}