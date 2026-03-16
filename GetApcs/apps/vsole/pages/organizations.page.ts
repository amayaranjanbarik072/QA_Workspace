// Organizations page
import { Page } from "@playwright/test";
import { BasePage } from "../../core/base/basePage";

export class OrganizationsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
}