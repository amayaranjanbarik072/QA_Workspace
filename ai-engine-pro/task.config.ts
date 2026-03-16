// ══════════════════════════════════════════════════════════
//  ✏️  EDIT THIS FILE ONLY — then run: npm start
// ══════════════════════════════════════════════════════════

export const taskConfig = {

  // 🌐 URL of the application to test
  url: "https://vsole.getapcs.com/",

  // 📁 Playwright project folder name (inside my-qa-workspace/)
  project: "project-erp",

  // 🔐 Login credentials — used by MCP to scan authenticated pages
  credentials: {
    username: "amaya@mail.com",
    password: "amaya@123",
    unit:     "Bangalore",   // leave "" if no unit dropdown
  },

  // 🧭 Pages MCP will navigate & scan after login (in order)
  // MCP clicks each item and scans that page's full DOM
  scanPath: [
    "Engineering",
    "Item Master",
    "Item Master Create",
  ],

  // 📋 Plain English — describe exactly what to test
  prompt: `
    Login to the application with username amaya@mail.com, password amaya@123
    and select the unit as Bangalore.
    After login if any popup appears saying someone else is logged in, click Yes.
    Navigate to Engineering module.
    Navigate to Item Master then Item Master Create page.
    Explore all tabs: General Description, Alternates, Engineering, Dimensions,
    Routing, Approved Vendor List, Planning, Warehouse, Shipping, Quality, Costing.
    Create 3 items:
      - Name: FG Item1,  Type: FG
      - Name: SA Item1,  Type: SA
      - Name: PP Item1,  Type: PurchasePart
    After each creation validate the item appears in the item list table.
  `,

  // 📄 Output file names (saved inside your project folder)
  output: {
    pageObject: "pages/ItemMasterCreate.page.ts",
    specFile:   "tests/generated/ItemMasterCreate.spec.ts",
    report:     "resources/reports/report.md",
  },

};