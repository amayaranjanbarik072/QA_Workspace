// Hierarchy page
import { Page } from "@playwright/test";
import { BasePage } from "../../core/base/basePage";

export class HierarchyPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
}