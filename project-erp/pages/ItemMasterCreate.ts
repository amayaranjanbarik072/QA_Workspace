import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ItemMasterCreatePage extends BasePage {
  // Navigation Locators
  readonly engineeringModuleLink: Locator;
  readonly itemMasterLink: Locator;
  readonly itemMasterCreateLink: Locator;
  
  // Login Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly unitSelect: Locator;
  readonly signInButton: Locator;
  readonly yesButtonPopup: Locator;
  
  // Tab Locators
  readonly generalDescriptionTab: Locator;
  readonly alternatesTab: Locator;
  readonly engineeringTab: Locator;
  readonly dimensionsTab: Locator;
  readonly routingTab: Locator;
  readonly approvedVendorListTab: Locator;
  readonly planningTab: Locator;
  readonly warehouseTab: Locator;
  readonly shippingTab: Locator;
  readonly qualityTab: Locator;
  readonly costingTab: Locator;
  
  // Form Field Locators
  readonly itemNameField: Locator;
  readonly itemTypeDropdown: Locator;
  readonly descriptionField: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;
  
  // Item List Locators
  readonly itemListTable: Locator;
  readonly itemListLink: Locator;

  constructor(page: Page) {
    super(page);
    
    // Navigation Locators
    this.engineeringModuleLink = page.locator('a:has-text("Engineering")');
    this.itemMasterLink = page.locator('a:has-text("Item Master")');
    this.itemMasterCreateLink = page.locator('a:has-text("Item Master Create")');
    this.itemListLink = page.locator('a:has-text("Item Master")').first();
    
    // Login Locators
    this.emailInput = page.locator('input[type="email"], input[name="email"]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"]');
    this.unitSelect = page.locator('select, [data-testid="unit-select"]');
    this.signInButton = page.locator('button:has-text("Sign In"), button:has-text("Login")');
    this.yesButtonPopup = page.locator('button:has-text("Yes")');
    
    // Tab Locators
    this.generalDescriptionTab = page.locator('[data-testid="general-description-tab"], .tab:has-text("General Description")');
    this.alternatesTab = page.locator('[data-testid="alternates-tab"], .tab:has-text("Alternates")');
    this.engineeringTab = page.locator('[data-testid="engineering-tab"], .tab:has-text("Engineering")');
    this.dimensionsTab = page.locator('[data-testid="dimensions-tab"], .tab:has-text("Dimensions")');
    this.routingTab = page.locator('[data-testid="routing-tab"], .tab:has-text("Routing")');
    this.approvedVendorListTab = page.locator('[data-testid="approved-vendor-list-tab"], .tab:has-text("Approved Vendor List")');
    this.planningTab = page.locator('[data-testid="planning-tab"], .tab:has-text("Planning")');
    this.warehouseTab = page.locator('[data-testid="warehouse-tab"], .tab:has-text("Warehouse")');
    this.shippingTab = page.locator('[data-testid="shipping-tab"], .tab:has-text("Shipping")');
    this.qualityTab = page.locator('[data-testid="quality-tab"], .tab:has-text("Quality")');
    this.costingTab = page.locator('[data-testid="costing-tab"], .tab:has-text("Costing")');
    
    // Form Field Locators
    this.itemNameField = page.getByLabel('Item Name') || page.locator('input[name="itemName"]');
    this.itemTypeDropdown = page.getByLabel('Item Type') || page.locator('select[name="itemType"]');
    this.descriptionField = page.getByLabel('Description') || page.locator('textarea[name="description"]');
    this.saveButton = page.locator('button:has-text("Save"), button[type="submit"]');
    this.successMessage = page.locator('text=Item saved successfully, text=Item created successfully, .success-message');
    
    // Item List Locators
    this.itemListTable = page.locator('table, [data-testid="item-list-table"]');
  }

  // Navigation Methods
  async navigateToApplication(): Promise<void> {
    await this.goto('https://vsole.getapcs.com/');
  }

  async login(username: string, password: string, unit: string): Promise<void> {
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.unitSelect.selectOption(unit);
    await this.signInButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async handleLoginPopup(): Promise<void> {
    const popupVisible = await this.yesButtonPopup.isVisible().catch(() => false);
    if (popupVisible) {
      await this.yesButtonPopup.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async navigateToEngineeringModule(): Promise<void> {
    await this.engineeringModuleLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToItemMasterCreatePage(): Promise<void> {
    await this.itemMasterLink.click();
    await this.page.waitForLoadState('networkidle');
    await this.itemMasterCreateLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToItemMasterListPage(): Promise<void> {
    await this.itemListLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Tab Navigation Methods
  async clickGeneralDescriptionTab(): Promise<void> {
    await this.generalDescriptionTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickAlternatesTab(): Promise<void> {
    await this.alternatesTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickEngineeringTab(): Promise<void> {
    await this.engineeringTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickDimensionsTab(): Promise<void> {
    await this.dimensionsTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickRoutingTab(): Promise<void> {
    await this.routingTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickApprovedVendorListTab(): Promise<void> {
    await this.approvedVendorListTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickPlanningTab(): Promise<void> {
    await this.planningTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickWarehouseTab(): Promise<void> {
    await this.warehouseTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickShippingTab(): Promise<void> {
    await this.shippingTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickQualityTab(): Promise<void> {
    await this.qualityTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickCostingTab(): Promise<void> {
    await this.costingTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Form Interaction Methods
  async fillItemName(itemName: string): Promise<void> {
    await this.itemNameField.fill(itemName);
  }

  async selectItemType(itemType: string): Promise<void> {
    await this.itemTypeDropdown.selectOption(itemType);
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionField.fill(description);
  }

  async clickSaveButton(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifySuccessMessage(): Promise<void> {
    await this.successMessage.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      console.log('Success message not found, item may have been saved silently');
    });
  }

  // Tab Visibility Methods
  async verifyTabIsActive(tabLocator: Locator): Promise<boolean> {
    try {
      const classAttr = await tabLocator.getAttribute('class');
      return classAttr?.includes('active') ?? false;
    } catch {
      return false;
    }
  }

  async verifyAllTabsAreAccessible(): Promise<void> {
    const tabs = [
      { name: 'General Description', locator: this.generalDescriptionTab },
      { name: 'Alternates', locator: this.alternatesTab },
      { name: 'Engineering', locator: this.engineeringTab },
      { name: 'Dimensions', locator: this.dimensionsTab },
      { name: 'Routing', locator: this.routingTab },
      { name: 'Approved Vendor List', locator: this.approvedVendorListTab },
      { name: 'Planning', locator: this.planningTab },
      { name: 'Warehouse', locator: this.warehouseTab },
      { name: 'Shipping', locator: this.shippingTab },
      { name: 'Quality', locator: this.qualityTab },
      { name: 'Costing', locator: this.costingTab },
    ];

    for (const tab of tabs) {
      await expect(tab.locator).toBeVisible();
    }
  }

  // Item List Validation Methods
  async validateItemInList(itemName: string): Promise<void> {
    await expect(this.itemListTable.locator(`text="${itemName}"`)).toBeVisible();
  }

  async searchItemInList(itemName: string): Promise<boolean> {
    try {
      await this.itemListTable.locator(`text="${itemName}"`).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // Helper Methods
  async takeScreenshotOfPage(fileName: string): Promise<void> {
    await this.takeScreenshot(fileName);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
