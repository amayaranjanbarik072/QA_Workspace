import { test, expect } from '@playwright/test';
import { GeneratedPage } from '../../pages/generated.page';

test.describe('Item Master Create and List Functionality', () => {
  let generatedPage: GeneratedPage;

  test.beforeEach(async ({ page }) => {
    generatedPage = new GeneratedPage(page);
    await generatedPage.navigate();
    await generatedPage.login('amaya@mail.com', 'amaya@123', 'Bangalore');
    await generatedPage.navigateToEngineeringModule();
    await generatedPage.navigateToItemMasterCreatePage();
  });

  test('should validate all tabs on Item Master Create page', async () => {
    await generatedPage.clickGeneralDescriptionTab();
    await expect(generatedPage.generalDescriptionTab).toHaveClass(/active/);
    // Add more specific assertions for elements within the tab if available in DOM context

    await generatedPage.clickAlternatesTab();
    await expect(generatedPage.alternatesTab).toHaveClass(/active/);

    await generatedPage.clickEngineeringTab();
    await expect(generatedPage.engineeringTab).toHaveClass(/active/);

    await generatedPage.clickDimensionsTab();
    await expect(generatedPage.dimensionsTab).toHaveClass(/active/);

    await generatedPage.clickRoutingTab();
    await expect(generatedPage.routingTab).toHaveClass(/active/);

    await generatedPage.clickApprovedVendorListTab();
    await expect(generatedPage.approvedVendorListTab).toHaveClass(/active/);

    await generatedPage.clickPlanningTab();
    await expect(generatedPage.planningTab).toHaveClass(/active/);

    await generatedPage.clickWarehouseTab();
    await expect(generatedPage.warehouseTab).toHaveClass(/active/);

    await generatedPage.clickShippingTab();
    await expect(generatedPage.shippingTab).toHaveClass(/active/);

    await generatedPage.clickQualityTab();
    await expect(generatedPage.qualityTab).toHaveClass(/active/);

    await generatedPage.clickCostingTab();
    await expect(generatedPage.costingTab).toHaveClass(/active/);
  });

  test('should create an FG Item', async () => {
    await generatedPage.fillItemName('FG Item1');
    await generatedPage.selectItemType('FG');
    await generatedPage.clickSaveButton();
    // Add assertion for successful save, e.g., a success message or redirection
    await expect(generatedPage.page.locator('text=Item saved successfully')).toBeVisible(); // Assuming a success message appears
  });

  test('should create an SA Item', async () => {
    await generatedPage.navigateToItemMasterCreatePage(); // Navigate back to create page
    await generatedPage.fillItemName('SA Item1');
    await generatedPage.selectItemType('SA');
    await generatedPage.clickSaveButton();
    await expect(generatedPage.page.locator('text=Item saved successfully')).toBeVisible(); // Assuming a success message appears
  });

  test('should create a PP Item', async () => {
    await generatedPage.navigateToItemMasterCreatePage(); // Navigate back to create page
    await generatedPage.fillItemName('PP Item1');
    await generatedPage.selectItemType('PurchasePart');
    await generatedPage.clickSaveButton();
    await expect(generatedPage.page.locator('text=Item saved successfully')).toBeVisible(); // Assuming a success message appears
  });

  test('should validate created items in the Item List', async () => {
    await generatedPage.navigateToItemList();
    await generatedPage.validateItemInList('FG Item1');
    await generatedPage.validateItemInList('SA Item1');
    await generatedPage.validateItemInList('PP Item1');
  });
});
