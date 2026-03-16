import { Page } from '@playwright/test';

export class ToastUtils {
  static toastMessage = '#toast-container';

  /**
   * Waits for toast and returns text
   */
  async getToastMessage(
    page: Page,
    timeout: number = 5000
  ): Promise<string | null> {
    const toast = page.locator(ToastUtils.toastMessage);

    try {
      await toast.waitFor({ state: 'visible', timeout });
      const message = (await toast.textContent())?.trim() || '';
      console.log('🔔 Toast Message:', message);
      return message;
    } catch {
      console.log('ℹ️ No toast message displayed');
      return null;
    }
  }

  /**
   * Validate toast contains expected text
   */
  async verifyToastMessage(
    page: Page,
    expectedText: string,
    timeout: number = 5000
  ): Promise<boolean> {
    const toast = page.locator(ToastUtils.toastMessage);
    await toast.waitFor({ state: 'visible', timeout });

    const actualText = (await toast.textContent())?.trim() || '';
    return actualText.includes(expectedText);
  }

  /**
   * Wait for toast to disappear
   */
  async waitForToastDisappear(page: Page, timeout: number = 5000): Promise<void> {
    const toast = page.locator(ToastUtils.toastMessage);
    await toast.waitFor({ state: 'hidden', timeout }).catch(() => null);
  }
}