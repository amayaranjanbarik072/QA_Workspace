import { Locator, Page } from '@playwright/test';

export class DateUtil {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Generates a date string for native HTML5 date inputs (YYYY-MM-DD)
   * @param offset Days from today (e.g., 0 for today, 7 for next week, -1 for yesterday)
   */
  async getFormattedDate(offset: number = 0): Promise<string> {
    const date = new Date();
    date.setDate(date.getDate() + offset);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Selects a date without triggering neighboring pop-ups
   */
  async selectDate(dateField: Locator, targetDate: string): Promise<void> {
    await dateField.waitFor({ state: 'visible' });
    await dateField.fill(targetDate);
    await dateField.blur();
  }

  /**
   * Returns formatted date string (DD/MM/YYYY)
   */
  async getFormattedDateDisplay(offset: number = 0): Promise<string> {
    const date = new Date();
    date.setDate(date.getDate() + offset);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
  }
}