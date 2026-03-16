import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../../core/base/basePage';
import { DateUtil } from '../utils/DateUtil';
import { ToastUtils } from '../utils/ToastUtils';
import { TablePage } from '../utils/TablePage';

export class DemoTrassBasePage extends BasePage {
  dateUtil: DateUtil;
  toastUtil: ToastUtils;
  tablePageUtil: TablePage;

  constructor(page: Page) {
    super(page);
    this.dateUtil = new DateUtil(page);
    this.toastUtil = new ToastUtils();
    this.tablePageUtil = new TablePage(page);
  }

  // Robust click: waits for locator and clicks (retries briefly)
  async robustClick(locator: Locator) {
    await locator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
    await locator.click();
  }

  // Select first option by providing field locator string and option list locator string
  async selectFirstOption(fieldLocator: string, optionListLocator: string) {
    await this.page.locator(fieldLocator).click();
    await this.page.waitForTimeout(300);
    const first = this.page.locator(optionListLocator).first();
    await first.click();
  }

  // Alternate version accepting Locator objects
  async selectFirstOption1(field: Locator, optionList: Locator) {
    await field.click();
    await this.page.waitForTimeout(300);
    await optionList.first().click();
  }

  // Scroll to and click an element
  async scrollAndClick(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  // Wait for element and verify visibility
  async waitForElement(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
  }
}