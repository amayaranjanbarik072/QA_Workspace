import { test, expect } from './fixture';
import { EnvUtils } from '../utils/envUtils';

test.describe('Demo-Trass Dashboard Tests', () => {

  test.beforeEach(async ({ page, loginPage }) => {
    EnvUtils.printEnvInfo();
    await page.goto(EnvUtils.getBaseUrl() + '/login');
    await loginPage.validLogin();
  });

  test('Dashboard Visibility After Login', async ({ dashboardPage }) => {
    const isVisible = await dashboardPage.isDashboardVisible();
    expect(isVisible).toBeTruthy();
  });

  test('Navigate to Org Config', async ({ dashboardPage }) => {
    await dashboardPage.navigateToOrgConfig();
    const title = await dashboardPage.getPageTitle();
    expect(title).toBeTruthy();
  });

  test('Navigate to Engineering', async ({ dashboardPage }) => {
    await dashboardPage.navigateToEngineering();
    const title = await dashboardPage.getPageTitle();
    expect(title).toBeTruthy();
  });

  test('Sign Out Test', async ({ dashboardPage, page }) => {
    await dashboardPage.signOut();
    // Should redirect to login page
    expect(page.url()).toContain('login');
  });
});