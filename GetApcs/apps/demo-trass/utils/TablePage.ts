import { Page, Locator } from '@playwright/test';

export class TablePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get all rows from a table
   */
  async getAllRows(tableLocator: string): Promise<Locator[]> {
    const rows = await this.page.locator(`${tableLocator} tbody tr`).all();
    return rows;
  }

  /**
   * Get specific row count
   */
  async getRowCount(tableLocator: string): Promise<number> {
    return await this.page.locator(`${tableLocator} tbody tr`).count();
  }

  /**
   * Get cell value from table
   */
  async getCellValue(tableLocator: string, rowIndex: number, cellIndex: number): Promise<string> {
    const cell = this.page.locator(`${tableLocator} tbody tr:nth-child(${rowIndex}) td:nth-child(${cellIndex})`);
    return (await cell.textContent()) || '';
  }

  /**
   * Click row by index
   */
  async clickRow(tableLocator: string, rowIndex: number): Promise<void> {
    const row = this.page.locator(`${tableLocator} tbody tr:nth-child(${rowIndex})`);
    await row.click();
  }

  /**
   * Search in table by keyword
   */
  async searchInTable(searchFieldLocator: string, keyword: string): Promise<void> {
    await this.page.locator(searchFieldLocator).fill(keyword);
    await this.page.waitForTimeout(500);
  }
}