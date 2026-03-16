import { DemoTrassBasePage } from './DemoTrassBasePage';
import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage extends DemoTrassBasePage {
  // Header locators
  private profileDropdown: Locator;
  private notificationDropdown: Locator;
  private signOutLink: Locator;

  // Navigation locators
  private dashboardHeader: Locator;
  private orgConfigHeader: Locator;
  private engineeringHeader: Locator;
  private salesAndMarketingHeader: Locator;
  private procurementHeader: Locator;

  // Dashboard content locators
  private pageTitle: Locator;
  private toastMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Header
    this.profileDropdown = this.page.locator('#profileDropdown');
    this.notificationDropdown = this.page.locator('#notificationDropdown');
    this.signOutLink = this.page.locator('a:has-text("Sign Out")');

    // Navigation
    this.dashboardHeader = this.page.locator('a[routerlink="/dashboard"]');
    this.orgConfigHeader = this.page.locator('a:has-text("Org Config")');
    this.engineeringHeader = this.page.locator('a:has-text("Engineering")');
    this.salesAndMarketingHeader = this.page.locator('a:has-text("Sales & Marketing")');
    this.procurementHeader = this.page.locator('a:has-text("Procurement")');

    // Content
    this.pageTitle = this.page.locator('h1, h2, [role="heading"]');
    this.toastMessage = this.page.locator('#toast-container');
  }

  async isDashboardVisible(): Promise<boolean> {
    return await this.dashboardHeader.isVisible();
  }

  async navigateToOrgConfig() {
    await this.robustClick(this.orgConfigHeader);
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToEngineering() {
    await this.robustClick(this.engineeringHeader);
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToSalesAndMarketing() {
    await this.robustClick(this.salesAndMarketingHeader);
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToProcurement() {
    await this.robustClick(this.procurementHeader);
    await this.page.waitForLoadState('networkidle');
  }

  async openProfileDropdown() {
    await this.robustClick(this.profileDropdown);
    await this.page.waitForTimeout(500);
  }

  async signOut() {
    await this.openProfileDropdown();
    await this.robustClick(this.signOutLink);
    await this.page.waitForLoadState('networkidle');
  }

  async getPageTitle(): Promise<string | null> {
    return await this.pageTitle.first().textContent();
  }
}