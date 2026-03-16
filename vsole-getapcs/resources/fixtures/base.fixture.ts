import { test as base } from "@playwright/test";
import { BasePage } from "../../pages/base.page";

type Fixtures = {
  basePage: BasePage;
};

export const test = base.extend<Fixtures>({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },
});

export { expect } from "@playwright/test";