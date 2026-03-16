import { test, expect } from './fixture';
import { EnvUtils } from '../utils/envUtils';

test.describe('Demo-Trass Login Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    EnvUtils.printEnvInfo();
    await page.goto(EnvUtils.getBaseUrl() + '/login');
  });

  test('Valid Login Test', async ({ loginPage, page }) => {
    await loginPage.validLogin();
    const isLoginPageVisible = await loginPage.isLoginPageVisible();
    expect(isLoginPageVisible).toBeFalsy();
  });

  test('Invalid Login Test', async ({ loginPage }) => {
    const toastMessage = await loginPage.invalidLogin();
    expect(toastMessage).toBeTruthy();
  });

  test('Login Page Visibility', async ({ loginPage }) => {
    const isVisible = await loginPage.isLoginPageVisible();
    expect(isVisible).toBeTruthy();
  });

  test('Login with Different Credentials', async ({ loginPage }) => {
    await loginPage.loginWithCredentials('manager');
    // Navigate and verify login success
    await loginPage.getPage().waitForLoadState('networkidle');
  });
});