import { DemoTrassBasePage } from './DemoTrassBasePage';
import { Page, Locator, expect } from '@playwright/test';
import { CREDENTIALS } from '../config/Credentials';
import { EnvUtils } from '../utils/envUtils';

export class LoginPage extends DemoTrassBasePage {
  private emailTextfield: Locator;
  private passwordTextfield: Locator;
  private selectUnitDropdown: Locator;
  private signInButton: Locator;
  private toastMessage: Locator;
  private errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailTextfield = this.page.locator('input[type="email"]');
    this.passwordTextfield = this.page.locator('input[type="password"]');
    this.selectUnitDropdown = this.page.locator('select[class*="login"]');
    this.signInButton = this.page.locator('button[class*="submit"]');
    this.toastMessage = this.page.locator('#toast-container');
    this.errorMessage = this.page.locator('[role="alert"]');
  }

  async login(username: string, password: string, unit: string = 'Bangalore') {
    await this.emailTextfield.fill(username);
    await this.passwordTextfield.fill(password);
    await this.selectUnitDropdown.selectOption(unit);
    await this.signInButton.click();
    await this.page.waitForTimeout(2000);
  }

  async loginWithCredentials(credentialKey: keyof typeof CREDENTIALS) {
    const creds = CREDENTIALS[credentialKey];
    await this.login(creds.username, creds.password, creds.unit);
  }

  async invalidLogin() {
    await this.login('invalid@mail.com', 'invalidPass@123');
    const toastText = await this.toastUtil.getToastMessage(this.page);
    console.log('🔔 Toast Message: ', toastText);
    return toastText;
  }

  async validLogin() {
    await this.loginWithCredentials('demoTras');
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage(): Promise<string | null> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
      return await this.errorMessage.textContent();
    } catch {
      return null;
    }
  }

  async isLoginPageVisible(): Promise<boolean> {
    return await this.emailTextfield.isVisible();
  }
}