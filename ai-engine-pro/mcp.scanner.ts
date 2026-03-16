// ══════════════════════════════════════════════════════════
//  MCP Deep Scanner
//  1. Logs in to the application
//  2. Navigates to each required page
//  3. Scans full DOM of every page
//  4. Returns rich context for AI code generation
// ══════════════════════════════════════════════════════════

import { chromium, Page } from "playwright";

export interface PageScan {
  page:     string;
  url:      string;
  fields:   { name: string; type: string; id: string; placeholder: string; label: string }[];
  buttons:  { text: string; id: string; class: string }[];
  links:    { text: string; href: string; class: string }[];
  selects:  { name: string; id: string; options: string[] }[];
  tabs:     string[];
  tables:   { id: string; headers: string[] }[];
}

export interface DOMContext {
  summary:   string;
  pages:     PageScan[];
}

// ── Scan a single page's full DOM ───────────────────────────
async function scanDOM(page: Page, label: string): Promise<PageScan> {
  await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);

  const url   = page.url();
  const title = await page.title();

  const fields = await page.evaluate(() =>
    Array.from(document.querySelectorAll("input:not([type=hidden]), textarea")).map((el: any) => {
      // Try to find associated label
      let label = "";
      if (el.id) {
        const lbl = document.querySelector(`label[for="${el.id}"]`);
        if (lbl) label = lbl.innerText?.trim() || "";
      }
      if (!label) {
        const parent = el.closest(".form-group, .field, .input-group, td, div");
        if (parent) {
          const lbl = parent.querySelector("label, .label, th");
          if (lbl) label = lbl.innerText?.trim() || "";
        }
      }
      return {
        name:        el.name        || "",
        type:        el.type        || "text",
        id:          el.id          || "",
        placeholder: el.placeholder || "",
        label:       label,
      };
    }).filter(f => f.id || f.name || f.placeholder)
  );

  const buttons = await page.evaluate(() =>
    Array.from(document.querySelectorAll(
      "button, [type=submit], [role=button], .btn, .button"
    )).map((el: any) => ({
      text:  el.innerText?.trim() || el.value || "",
      id:    el.id       || "",
      class: el.className || "",
    })).filter(b => b.text).slice(0, 20)
  );

  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll(
      "a, [role=menuitem], [role=link], .nav-item, .menu-item, .sidebar-item"
    )).map((el: any) => ({
      text:  el.innerText?.trim() || "",
      href:  el.getAttribute("href") || "",
      class: el.className || "",
    })).filter(l => l.text && l.text.length > 1).slice(0, 40)
  );

  const selects = await page.evaluate(() =>
    Array.from(document.querySelectorAll("select")).map((el: any) => ({
      name:    el.name || "",
      id:      el.id   || "",
      options: Array.from(el.options)
                 .map((o: any) => o.text.trim())
                 .filter(Boolean)
                 .slice(0, 10),
    }))
  );

  const tabs = await page.evaluate(() =>
    Array.from(document.querySelectorAll(
      "[role=tab], .tab, .nav-tab, .tab-item, li[data-tab]"
    )).map((el: any) => el.innerText?.trim())
     .filter(Boolean)
  );

  const tables = await page.evaluate(() =>
    Array.from(document.querySelectorAll("table")).map((t: any, i) => ({
      id: t.id || `table_${i}`,
      headers: Array.from(t.querySelectorAll("th"))
                   .map((th: any) => th.innerText?.trim())
                   .filter(Boolean),
    }))
  );

  console.log(`   📄 [${label}] fields:${fields.length} buttons:${buttons.length} tabs:${tabs.length} tables:${tables.length}`);

  return { page: label, url, fields, buttons, links, selects, tabs, tables };
}

// ── Try to click a nav item by text ────────────────────────
async function clickNav(page: Page, text: string): Promise<boolean> {
  const selectors = [
    `a:has-text("${text}")`,
    `[role=menuitem]:has-text("${text}")`,
    `li:has-text("${text}")`,
    `span:has-text("${text}")`,
    `div:has-text("${text}")`,
    `button:has-text("${text}")`,
  ];

  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 3000 })) {
        await el.click();
        await page.waitForTimeout(1500);
        return true;
      }
    } catch { continue; }
  }
  return false;
}

// ── Main export ─────────────────────────────────────────────
export async function scanPage(
  url: string,
  credentials?: { username: string; password: string; unit?: string },
  navigationPath?: string[]   // e.g. ["Engineering", "Item Master", "Item Master Create"]
): Promise<DOMContext> {

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page    = await context.newPage();
  const scans:  PageScan[] = [];

  try {
    // ══ STEP 1: Go to app ═══════════════════════════════
    console.log(`   🌐 Opening: ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2000);

    // ══ STEP 2: Scan login page ══════════════════════════
    const loginScan = await scanDOM(page, "Login Page");
    scans.push(loginScan);

    // ══ STEP 3: Login if credentials given ══════════════
    if (credentials) {
      console.log("   🔐 Logging in...");

      // Fill email/username
      for (const sel of ['input[type="email"]', 'input[name="username"]', 'input[name="email"]', '#username', '#email']) {
        try {
          const el = page.locator(sel).first();
          if (await el.isVisible({ timeout: 2000 })) {
            await el.fill(credentials.username);
            break;
          }
        } catch { continue; }
      }

      // Fill password
      for (const sel of ['input[type="password"]', 'input[name="password"]', '#password']) {
        try {
          const el = page.locator(sel).first();
          if (await el.isVisible({ timeout: 2000 })) {
            await el.fill(credentials.password);
            break;
          }
        } catch { continue; }
      }

      // Select unit
      if (credentials.unit) {
        try {
          const sel = page.locator("select").first();
          if (await sel.isVisible({ timeout: 2000 })) {
            await sel.selectOption({ label: credentials.unit })
              .catch(() => sel.selectOption({ value: credentials.unit! }));
          }
        } catch { }
      }

      // Click login button
      for (const sel of [
        'button:has-text("Sign In")',
        'button:has-text("Login")',
        'button[type="submit"]',
        '#loginBtn',
      ]) {
        try {
          const el = page.locator(sel).first();
          if (await el.isVisible({ timeout: 2000 })) {
            await el.click();
            await page.waitForLoadState("networkidle", { timeout: 15000 });
            await page.waitForTimeout(2000);
            break;
          }
        } catch { continue; }
      }

      // Handle "someone else logged in" popup
      for (const sel of [
        'button:has-text("Yes")',
        'button:has-text("YES")',
        '.confirm-btn',
        '[data-action="confirm"]',
      ]) {
        try {
          const el = page.locator(sel).first();
          if (await el.isVisible({ timeout: 3000 })) {
            await el.click();
            await page.waitForTimeout(1500);
            console.log("   ✅ Handled login popup");
            break;
          }
        } catch { continue; }
      }

      console.log(`   ✅ Logged in → ${page.url()}`);

      // ── Scan dashboard/home after login ────────────────
      const dashScan = await scanDOM(page, "Dashboard");
      scans.push(dashScan);
    }

    // ══ STEP 4: Navigate deep and scan each page ════════
    if (navigationPath && navigationPath.length > 0) {
      console.log(`   🧭 Navigating: ${navigationPath.join(" → ")}`);

      for (const navItem of navigationPath) {
        const clicked = await clickNav(page, navItem);
        if (clicked) {
          console.log(`   ✅ Navigated to: ${navItem}`);
          const navScan = await scanDOM(page, navItem);
          scans.push(navScan);
        } else {
          console.log(`   ⚠️  Could not find nav item: "${navItem}"`);
        }
      }
    }

    // ══ STEP 5: Build rich summary for AI ═══════════════
    const summary = scans.map(s => `
━━━ PAGE: ${s.page} ━━━
URL: ${s.url}
Fields (${s.fields.length}):
${s.fields.map(f => `  - ${f.label || f.placeholder || f.name} [id="${f.id}" name="${f.name}" type="${f.type}"]`).join("\n")}
Buttons: ${s.buttons.map(b => `"${b.text}"[id="${b.id}"]`).join(", ")}
Tabs: ${s.tabs.join(", ")}
Nav Links: ${s.links.slice(0, 15).map(l => `"${l.text}"`).join(", ")}
Dropdowns: ${s.selects.map(s => `${s.id||s.name}(${s.options.join("|")})`).join(", ")}
Tables: ${s.tables.map(t => `[${t.headers.join(", ")}]`).join(", ")}
    `.trim()).join("\n\n");

    console.log(`\n   ✅ Total pages scanned: ${scans.length}`);

    return { summary, pages: scans };

  } finally {
    await browser.close();
  }
}