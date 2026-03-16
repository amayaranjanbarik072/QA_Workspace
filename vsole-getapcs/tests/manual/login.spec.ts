// Update the import path to the correct location of base.fixture
import { test } from "../../resources/fixtures/base.fixture";
import { LoginPage } from "../../pages/login.page";

test.describe("Login Tests", () => {
  test("should login successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto("https://example.com/login"); // Replace with actual URL
    await loginPage.login("testuser", "testpass");
    await loginPage.isLoggedIn();
  });
});