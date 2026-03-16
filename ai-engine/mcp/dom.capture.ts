import * as dotenv from "dotenv";
dotenv.config();

export interface FormField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  placeholder: string;
  label: string;
}

export interface PageContext {
  url: string;
  title: string;
  fields: FormField[];
  buttons: string[];
  navigation: string[];
}

export async function capturePageContext(url: string): Promise<PageContext> {
  try {
    // Dynamic import of playwright
    const { chromium } = await import("playwright");

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log(`🔍 MCP scanning: ${url}`);
    await page.goto(url, { waitUntil: "networkidle" });

    const title = await page.title();

    // Capture all form fields
    const fields: FormField[] = await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll("input, select, textarea")
      );
      return inputs.map((el: any) => ({
        id: el.id || "",
        name: el.name || "",
        type: el.type || el.tagName.toLowerCase(),
        required: el.required || false,
        placeholder: el.placeholder || "",
        label:
          document.querySelector(`label[for="${el.id}"]`)?.textContent?.trim() || "",
      }));
    });

    // Capture all buttons
const buttons: string[] = await page.evaluate(() => {
  return Array.from(document.querySelectorAll("button, [type='submit']"))
    .map((el) => (el as HTMLElement).textContent?.trim() || "")
    .filter((text) => text.length > 0);
});

    // Capture navigation links
const navigation: string[] = await page.evaluate(() => {
  return Array.from(document.querySelectorAll("nav a, .menu a, .sidebar a"))
    .map((el) => (el as HTMLElement).textContent?.trim() || "")
    .filter((text) => text.length > 0);
});

    await browser.close();

    const context: PageContext = { url, title, fields, buttons, navigation };
    console.log(`✅ MCP captured: ${fields.length} fields, ${buttons.length} buttons`);
    return context;

  } catch (error) {
    console.error("MCP Error:", error);
    throw error;
  }
}