import { taskConfig } from "./task.config";
import { capturePageContext } from "./mcp/dom.capture";
import { formatContextForAI, saveContext } from "./mcp/context.manager";
import { askGemini } from "./gemini/gemini.client";
import { ANALYZE_PROMPT } from "./gemini/prompts";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";

dotenv.config();

async function run() {
  console.log("\n🚀 AI QA Engine Starting...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🌐 URL     : ${taskConfig.url}`);
  console.log(`📁 Project : ${taskConfig.project}`);
  console.log(`📋 Prompt  : ${taskConfig.prompt.trim()}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const projectPath = path.join(__dirname, `../${taskConfig.project}`);

  try {

    // ── STEP 1: MCP scans the page ──────────────────
    console.log("📡 Step 1: MCP scanning your application...");
    const pageContext = await capturePageContext(taskConfig.url);
    saveContext(taskConfig.project, pageContext);
    const domContext = formatContextForAI(pageContext);
    console.log("✅ Page scanned successfully!\n");

    // ── STEP 2: Gemini analyzes prompt ──────────────
    console.log("🧠 Step 2: Gemini analyzing your instructions...");
    const stepsJson = await askGemini(ANALYZE_PROMPT(taskConfig.prompt));
    console.log("✅ Instructions analyzed!\n");
    console.log("📋 Test Steps Identified:");
    console.log(stepsJson);

    // ── STEP 3: CrewAI generates & runs ─────────────
    if (taskConfig.options.generateCode) {
      console.log("\n🤖 Step 3: CrewAI generating test code...");

     // ✅ NEW — correct keys matching qa.crew.py
const crewInput = {
  prompt: taskConfig.prompt,
  domContext: domContext,
  steps: stepsJson,
  projectPath: projectPath,
  options: taskConfig.options
};

      // Save input for Python crew
      const tempFile = path.join(__dirname, "temp_input.json");
      fs.writeFileSync(tempFile, JSON.stringify(crewInput, null, 2));

      // Run CrewAI
      const crewScript = path.join(__dirname, "crew/qa.crew.py");
      execSync(`python "${crewScript}" "${tempFile}"`, {
        stdio: "inherit",
        cwd: path.join(__dirname, "crew"),
      });
    }

    // ── STEP 4: Show report ──────────────────────────
    if (taskConfig.options.generateReport) {
      console.log("\n📊 Step 4: Opening HTML Report...");
      execSync(`npx playwright show-report resources/reports/html`, {
        stdio: "inherit",
        cwd: projectPath,
      });
    }

    console.log("\n🎉 All Done!");
    console.log(`📁 Check your project: ${projectPath}`);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

run();