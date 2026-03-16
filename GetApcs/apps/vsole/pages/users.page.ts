// Users page
import { Page } from "@playwright/test";
import { BasePage } from "../../core/base/basePage";

export class UsersPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
}