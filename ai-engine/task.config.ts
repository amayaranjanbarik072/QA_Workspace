// ============================================
// 🤖 AI QA Engine - Task Configuration
// Just fill in your details below and run!
// ============================================

export const taskConfig = {

  // 🌐 Your application URL
  url: "https://vsole.getapcs.com/",

  // 📁 Your project folder name
  project: "project-erp",

  // 📋 Your plain English instruction
  prompt: `
    Login to the application with username amaya@mail.com, password amaya@123 and select the unit as Bangalore. After login if any pop up is comming saying someone else is login ot using then click on yes button.
    Navigate to Engineering module.
    Navigate to Item Master, Click on Item Master dropdown then navigate to Item Master Create page, explore each tabs(General Description, Alternates, Engineering, Dimensions, Routing, Approved Vendor List, Planning, Warehouse, Shipping, Quality and Costing) and each elemnts, create a new page object file for Item Master Create(ItemMasterCreate.ts) as well create a test file(ItemMasterCreate.spec.ts).
    Fill the details(Create 3 items with Name FG Item1, SA Item1, PP Item1 and Type as FG, SA and PurchasePart respectively) to each fields and dropdowns and save the item, validate the item is created successfully by checking the item list on table page.
  `,

  // ⚙️ Options
  options: {
    headless: false,        // true = no browser window, false = see browser
    generateCode: true,     // generate playwright code
    runTests: true,         // run tests after generating
    generateReport: true,   // generate HTML report after run
  }

};