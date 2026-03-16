import { Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string) {
    await this.fillField("Username", username);
    await this.fillField("Password", password);
    await this.clickButton("Login");
  }

  async isLoggedIn(): Promise<boolean> {
    // Check for some element that indicates login success
    return await this.page.locator('.dashboard').isVisible();
  }
}