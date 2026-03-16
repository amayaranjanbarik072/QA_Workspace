// ══════════════════════════════════════════════════════════
//  AI QA Engine — Main Orchestrator
//  Run: npm start
// ══════════════════════════════════════════════════════════

import * as path    from "path";
import * as fs      from "fs";
import { execSync } from "child_process";
import * as dotenv  from "dotenv";
import { taskConfig }  from "./task.config";
import { askAI }       from "./ai.client";
import { scanPage }    from "./mcp.scanner";

dotenv.config();

const LINE = "━".repeat(50);

async function run() {
  const projectPath = path.resolve(__dirname, `../${taskConfig.project}`);
  const pageObjPath = path.join(projectPath, taskConfig.output.pageObject);
  const specPath    = path.join(projectPath, taskConfig.output.specFile);
  const reportPath  = path.join(projectPath, taskConfig.output.report);

  // ── Header ───────────────────────────────────────────────
  console.log(`\n🚀 AI QA Engine\n${LINE}`);
  console.log(`🌐 URL     : ${taskConfig.url}`);
  console.log(`📁 Project : ${taskConfig.project}`);
  console.log(`${LINE}\n`);

  try {

    // ══ STEP 1: Deep MCP Scan ════════════════════════════════
    console.log("📡 Step 1: Deep scanning application...");
    console.log("   (Login → navigate → scan each page)\n");

    const domResult = await scanPage(
      taskConfig.url,
      taskConfig.credentials,   // ← from task.config.ts
      taskConfig.scanPath        // ← from task.config.ts
    );

    // Save full schema for reference
    const schemaDir = path.join(projectPath, "resources/schemas");
    fs.mkdirSync(schemaDir, { recursive: true });
    fs.writeFileSync(
      path.join(schemaDir, "dom.schema.json"),
      JSON.stringify(domResult.pages, null, 2)
    );

    console.log(`\n✅ Step 1 done — ${domResult.pages.length} pages scanned\n`);

    // ══ STEP 2: Analyse prompt with AI ══════════════════════
    console.log("🧠 Step 2: Analysing instructions...");

    const analysisPrompt = `
You are a QA analyst. Convert this test instruction into a JSON array of steps.
Each step: { "step": number, "action": string, "target": string, "value": string }
Return ONLY the JSON array. No markdown, no explanation.

Instruction:
${taskConfig.prompt.trim()}
    `.trim();

    const stepsRaw  = await askAI(analysisPrompt);
    const stepsJson = stepsRaw.replace(/```json|```/g, "").trim();
    console.log("✅ Step 2 done\n");
    console.log("📋 Test Steps:");
    try { console.log(JSON.stringify(JSON.parse(stepsJson), null, 2)); }
    catch { console.log(stepsJson); }

    // ══ STEP 3: Generate & run tests via CrewAI ══════════════
    console.log("\n🤖 Step 3: Generating & running tests...");

    const input = {
      prompt:      taskConfig.prompt.trim(),
      projectPath: projectPath,
      domContext:  domResult.summary,  // ← rich multi-page DOM context
      pageObjPath: pageObjPath,
      specPath:    specPath,
      reportPath:  reportPath,
    };

    const tempFile   = path.join(__dirname, "temp_input.json");
    const crewScript = path.join(__dirname, "crew/crew_runner.py");
    fs.writeFileSync(tempFile, JSON.stringify(input, null, 2));

    const pythonCmd = process.platform === "win32" ? "py" : "python3";
    execSync(`${pythonCmd} "${crewScript}" "${tempFile}"`, {
      stdio: "inherit",
    });
    console.log("✅ Step 3 done\n");

    // ══ STEP 4: Show HTML Report ═════════════════════════════
    console.log("📊 Step 4: Opening HTML report...");
    try {
      execSync("npx playwright show-report resources/reports/html", {
        stdio: "inherit",
        cwd: projectPath,
      });
    } catch (e: any) {
      if (e.message?.includes("EADDRINUSE")) {
        console.log("📊 Report already open → http://localhost:9323");
      } else {
        console.log(`⚠️  Open manually: cd ${projectPath} && npx playwright show-report`);
      }
    }

    // ══ Done ═════════════════════════════════════════════════
    console.log(`\n${LINE}`);
    console.log("🎉 All done!");
    console.log("📁 Files generated:");
    console.log(`   ${pageObjPath}`);
    console.log(`   ${specPath}`);
    console.log(`   ${reportPath}`);
    console.log(`${LINE}\n`);

  } catch (err: any) {
    console.error(`\n❌ Engine failed: ${err.message}`);
    process.exit(1);
  }
}

run();