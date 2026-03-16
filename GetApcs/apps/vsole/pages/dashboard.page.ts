// Dashboard page
import { Page } from "@playwright/test";
import { BasePage } from "../../core/base/basePage";

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async getDashboardTitle() {
    return this.page.title();
  }
}