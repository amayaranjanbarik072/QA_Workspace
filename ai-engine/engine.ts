import { capturePageContext } from "./mcp/dom.capture";
import { formatContextForAI, saveContext } from "./mcp/context.manager";
import { askGemini } from "./gemini/gemini.client";
import { ANALYZE_PROMPT } from "./gemini/prompts";
import * as dotenv from "dotenv";
import * as path from "path";
import { execSync } from "child_process";

dotenv.config();

// Get arguments from command line
const args = process.argv.slice(2);
const urlArg = args.find((a) => a.startsWith("--url="))?.split("=")[1];
const projectArg = args.find((a) => a.startsWith("--project="))?.split("=")[1];
const promptArg = args.find((a) => a.startsWith("--prompt="))?.split("=")[1];

async function main() {
  console.log("\n🚀 AI QA Engine Starting...\n");

  // Validate arguments
  if (!urlArg || !projectArg || !promptArg) {
    console.log("❌ Missing arguments!");
    console.log("Usage:");
    console.log(
      `  ts-node engine.ts --url=<url> --project=<project-folder> --prompt=<your instruction>`
    );
    console.log("\nExample:");
    console.log(
      `  ts-node engine.ts --url=https://example.com --project=project-erp --prompt="Login and navigate to dashboard"`
    );
    process.exit(1);
  }

  const projectPath = path.join(__dirname, `../${projectArg}`);

  try {
    // ── STEP 1: MCP captures the page ──────────────────────────
    console.log("📡 Step 1: MCP scanning the page...");
    const pageContext = await capturePageContext(urlArg);
    saveContext(projectArg, pageContext);
    const domContext = formatContextForAI(pageContext);
    console.log("✅ Page context captured!\n");

    // ── STEP 2: Gemini analyzes the prompt ─────────────────────
    console.log("🧠 Step 2: Gemini analyzing your prompt...");
    const analysisPrompt = ANALYZE_PROMPT(promptArg);
    const stepsJson = await askGemini(analysisPrompt);
    console.log("✅ Steps analyzed!\n");
    console.log("📋 Steps:");
    console.log(stepsJson);

    // ── STEP 3: CrewAI generates code & runs tests ──────────────
    console.log("\n🤖 Step 3: CrewAI generating code and running tests...");
    const crewScript = path.join(__dirname, "crew/qa.crew.py");

    // Pass data to Python CrewAI
    const crewInput = JSON.stringify({
      user_prompt: promptArg,
      dom_context: domContext,
      steps: stepsJson,
      project_path: projectPath,
    });

    // Write input to temp file
    const fs = require("fs");
    const tempFile = path.join(__dirname, "temp_input.json");
    fs.writeFileSync(tempFile, crewInput);

    // Run CrewAI
    execSync(`python ${crewScript} ${tempFile}`, {
      stdio: "inherit",
      cwd: path.join(__dirname, "crew"),
    });

    // ── STEP 4: Done! ───────────────────────────────────────────
    console.log("\n🎉 All done!");
    console.log(`📁 Check your project: ${projectPath}`);
    console.log(`📊 Report: ${projectPath}/resources/reports/report.md`);

  } catch (error) {
    console.error("❌ Engine Error:", error);
    process.exit(1);
  }
}

main();