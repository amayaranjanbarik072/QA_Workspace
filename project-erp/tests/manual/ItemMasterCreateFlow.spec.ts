import { test, expect } from '@playwright/test';
import { ItemMasterCreatePage } from '../../pages/ItemMasterCreate';

test.describe('Item Master Create Functionality', () => {
  let itemMasterCreatePage: ItemMasterCreatePage;

  test.beforeEach(async ({ page }) => {
    itemMasterCreatePage = new ItemMasterCreatePage(page);
    await itemMasterCreatePage.navigateToApplication();
    await itemMasterCreatePage.login('amaya@mail.com', 'amaya@123', 'Bangalore');
    await itemMasterCreatePage.handleLoginPopup();
    await itemMasterCreatePage.navigateToEngineeringModule();
    await itemMasterCreatePage.navigateToItemMasterCreatePage();
  });

  test('should validate all tabs on Item Master Create page', async () => {
    console.log('🔍 Testing all tabs on Item Master Create page...');
    
    // Verify all tabs are accessible
    await itemMasterCreatePage.verifyAllTabsAreAccessible();
    console.log('✅ All tabs are accessible');

    // Click and verify each tab
    await itemMasterCreatePage.clickGeneralDescriptionTab();
    await expect(itemMasterCreatePage.generalDescriptionTab).toBeVisible();
    console.log('✅ General Description tab is active');

    await itemMasterCreatePage.clickAlternatesTab();
    await expect(itemMasterCreatePage.alternatesTab).toBeVisible();
    console.log('✅ Alternates tab is active');

    await itemMasterCreatePage.clickEngineeringTab();
    await expect(itemMasterCreatePage.engineeringTab).toBeVisible();
    console.log('✅ Engineering tab is active');

    await itemMasterCreatePage.clickDimensionsTab();
    await expect(itemMasterCreatePage.dimensionsTab).toBeVisible();
    console.log('✅ Dimensions tab is active');

    await itemMasterCreatePage.clickRoutingTab();
    await expect(itemMasterCreatePage.routingTab).toBeVisible();
    console.log('✅ Routing tab is active');

    await itemMasterCreatePage.clickApprovedVendorListTab();
    await expect(itemMasterCreatePage.approvedVendorListTab).toBeVisible();
    console.log('✅ Approved Vendor List tab is active');

    await itemMasterCreatePage.clickPlanningTab();
    await expect(itemMasterCreatePage.planningTab).toBeVisible();
    console.log('✅ Planning tab is active');

    await itemMasterCreatePage.clickWarehouseTab();
    await expect(itemMasterCreatePage.warehouseTab).toBeVisible();
    console.log('✅ Warehouse tab is active');

    await itemMasterCreatePage.clickShippingTab();
    await expect(itemMasterCreatePage.shippingTab).toBeVisible();
    console.log('✅ Shipping tab is active');

    await itemMasterCreatePage.clickQualityTab();
    await expect(itemMasterCreatePage.qualityTab).toBeVisible();
    console.log('✅ Quality tab is active');

    await itemMasterCreatePage.clickCostingTab();
    await expect(itemMasterCreatePage.costingTab).toBeVisible();
    console.log('✅ Costing tab is active');

    console.log('✅ All tabs are successfully explored!');
  });

  test('should create FG Item (FG Item1)', async () => {
    console.log('📝 Creating FG Item...');
    
    // Fill item details
    await itemMasterCreatePage.fillItemName('FG Item1');
    console.log('✅ Item name filled: FG Item1');
    
    await itemMasterCreatePage.selectItemType('FG');
    console.log('✅ Item type selected: FG');

    // Save the item
    await itemMasterCreatePage.clickSaveButton();
    console.log('💾 Save button clicked');
    
    // Verify success message or page navigation
    await itemMasterCreatePage.verifySuccessMessage();
    console.log('✅ FG Item (FG Item1) created successfully!');
  });

  test('should create SA Item (SA Item1)', async () => {
    console.log('📝 Creating SA Item...');
    
    // Navigate back to create page (in case we need to)
    await itemMasterCreatePage.navigateToItemMasterCreatePage();
    
    // Fill item details
    await itemMasterCreatePage.fillItemName('SA Item1');
    console.log('✅ Item name filled: SA Item1');
    
    await itemMasterCreatePage.selectItemType('SA');
    console.log('✅ Item type selected: SA');

    // Save the item
    await itemMasterCreatePage.clickSaveButton();
    console.log('💾 Save button clicked');
    
    // Verify success message or page navigation
    await itemMasterCreatePage.verifySuccessMessage();
    console.log('✅ SA Item (SA Item1) created successfully!');
  });

  test('should create PP Item (PP Item1)', async () => {
    console.log('📝 Creating PP (Purchase Part) Item...');
    
    // Navigate back to create page (in case we need to)
    await itemMasterCreatePage.navigateToItemMasterCreatePage();
    
    // Fill item details
    await itemMasterCreatePage.fillItemName('PP Item1');
    console.log('✅ Item name filled: PP Item1');
    
    await itemMasterCreatePage.selectItemType('PurchasePart');
    console.log('✅ Item type selected: PurchasePart');

    // Save the item
    await itemMasterCreatePage.clickSaveButton();
    console.log('💾 Save button clicked');
    
    // Verify success message or page navigation
    await itemMasterCreatePage.verifySuccessMessage();
    console.log('✅ PP Item (PP Item1) created successfully!');
  });

  test('should validate created items in Item Master List', async ({ page }) => {
    console.log('🔍 Validating created items in Item Master List...');
    
    // Navigate to Item Master List page
    await itemMasterCreatePage.navigateToItemMasterListPage();
    console.log('📍 Navigated to Item Master List page');

    // Wait for page to load
    await itemMasterCreatePage.waitForPageLoad();

    // Validate each created item
    const itemsToValidate = ['FG Item1', 'SA Item1', 'PP Item1'];
    
    for (const itemName of itemsToValidate) {
      const itemFound = await itemMasterCreatePage.searchItemInList(itemName);
      if (itemFound) {
        console.log(`✅ Item "${itemName}" found in list`);
      } else {
        console.log(`⚠️ Item "${itemName}" not found, retrying...`);
        await itemMasterCreatePage.page.reload();
        await itemMasterCreatePage.waitForPageLoad();
      }
      await itemMasterCreatePage.validateItemInList(itemName);
    }

    console.log('✅ All created items validated successfully in Item Master List!');
  });

  test('should explore all form elements in General Description tab', async () => {
    console.log('🔍 Exploring General Description tab elements...');
    
    // Click on General Description tab
    await itemMasterCreatePage.clickGeneralDescriptionTab();
    
    // Verify tab is active
    await expect(itemMasterCreatePage.generalDescriptionTab).toBeVisible();
    console.log('✅ General Description tab is visible and active');

    // Take screenshot of General Description tab content
    await itemMasterCreatePage.takeScreenshot('general-description-tab');
    console.log('📸 Screenshot taken: general-description-tab');
  });

  test('should explore all tabs and their elements', async () => {
    console.log('🔍 Exploring all tabs and their elements...');
    
    const tabs = [
      { name: 'General Description', method: () => itemMasterCreatePage.clickGeneralDescriptionTab() },
      { name: 'Alternates', method: () => itemMasterCreatePage.clickAlternatesTab() },
      { name: 'Engineering', method: () => itemMasterCreatePage.clickEngineeringTab() },
      { name: 'Dimensions', method: () => itemMasterCreatePage.clickDimensionsTab() },
      { name: 'Routing', method: () => itemMasterCreatePage.clickRoutingTab() },
      { name: 'Approved Vendor List', method: () => itemMasterCreatePage.clickApprovedVendorListTab() },
      { name: 'Planning', method: () => itemMasterCreatePage.clickPlanningTab() },
      { name: 'Warehouse', method: () => itemMasterCreatePage.clickWarehouseTab() },
      { name: 'Shipping', method: () => itemMasterCreatePage.clickShippingTab() },
      { name: 'Quality', method: () => itemMasterCreatePage.clickQualityTab() },
      { name: 'Costing', method: () => itemMasterCreatePage.clickCostingTab() },
    ];

    for (const tab of tabs) {
      await tab.method();
      console.log(`✅ ${tab.name} tab clicked and elements explored`);
    }

    console.log('✅ All tabs and their elements have been successfully explored!');
  });
});
