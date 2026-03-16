import { Page, Locator, expect } from '@playwright/test';

export class GeneratedPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly unitSelect: Locator;
  readonly signInButton: Locator;
  readonly yesButtonPopup: Locator;
  readonly engineeringModuleLink: Locator;
  readonly itemMasterLink: Locator;
  readonly itemMasterCreateLink: Locator;
  readonly itemNameField: Locator;
  readonly itemTypeDropdown: Locator;
  readonly saveButton: Locator;
  readonly itemListTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.unitSelect = page.locator('select');
    this.signInButton = page.locator('button:has-text("Sign In")');
    this.yesButtonPopup = page.locator('button:has-text("Yes")'); // Assuming a generic "Yes" button for the pop-up
    this.engineeringModuleLink = page.locator('a:has-text("Engineering")'); // Assuming a link for the module
    this.itemMasterLink = page.locator('a:has-text("Item Master")'); // Assuming a link for Item Master
    this.itemMasterCreateLink = page.locator('a:has-text("Item Master Create")'); // Assuming a link for Item Master Create
    this.itemNameField = page.getByLabel('Item Name'); // Using getByLabel for robustness
    this.itemTypeDropdown = page.getByLabel('Item Type'); // Using getByLabel for robustness
    this.saveButton = page.locator('button:has-text("Save")');
    this.itemListTable = page.locator('table'); // Generic locator for the item list table
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://vsole.getapcs.com/');
  }

  async login(username: string, password: string, unit: string): Promise<void> {
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.unitSelect.selectOption(unit);
    await this.signInButton.click();
  }

  async clickYesOnPopup(): Promise<void> {
    // Check if the pop-up is visible before clicking
    if (await this.yesButtonPopup.isVisible()) {
      await this.yesButtonPopup.click();
    }
  }

  async navigateToEngineeringModule(): Promise<void> {
    await this.engineeringModuleLink.click();
  }

  async navigateToItemMasterCreatePage(): Promise<void> {
    await this.itemMasterLink.click();
    await this.itemMasterCreateLink.click();
  }

  async clickTab(tabName: string): Promise<void> {
    await this.page.locator(`text="${tabName}"`).click();
  }

  async fillItemName(itemName: string): Promise<void> {
    await this.itemNameField.fill(itemName);
  }

  async selectItemType(itemType: string): Promise<void> {
    await this.itemTypeDropdown.selectOption(itemType);
  }

  async fillOtherRequiredFields(): Promise<void> {
    // Placeholder for filling other required fields.
    // This method should be implemented with specific locators and values
    // based on the actual form structure.
    console.log('Filling other required fields (placeholder)');
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }

  async validateItemPresentInTable(itemName: string): Promise<void> {
    await expect(this.itemListTable.locator(`text="${itemName}"`)).toBeVisible();
  }
}
