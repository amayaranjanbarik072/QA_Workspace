// ══════════════════════════════════════════════════════════
//  UI Server — serves the web UI and runs the engine
//  Run: npm run ui
//  Open: http://localhost:3000
// ══════════════════════════════════════════════════════════

import * as http       from "http";
import * as fs         from "fs";
import * as path       from "path";
import * as url        from "url";
import { spawn }       from "child_process";
import * as dotenv     from "dotenv";

dotenv.config();

const PORT    = 3000;
const UI_FILE = path.join(__dirname, "ui.html");

// Track active runs per client
const clients: Map<string, http.ServerResponse> = new Map();

// ── Route handler ────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const parsed  = url.parse(req.url || "", true);
  const pathname = parsed.pathname || "/";

  // ── Serve UI ────────────────────────────────────────
  if (pathname === "/" || pathname === "/ui.html") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(fs.readFileSync(UI_FILE));
    return;
  }

  // ── Run engine — SSE stream ─────────────────────────
  if (pathname === "/run" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      let config: any = {};
      try { config = JSON.parse(body); } catch { }

      const clientId = Date.now().toString();

      res.writeHead(200, {
        "Content-Type":  "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection":    "keep-alive",
        "Access-Control-Allow-Origin": "*",
      });

      const send = (type: string, data: string) => {
        const lines = data.split("\n");
        lines.forEach(line => {
          if (line.trim()) res.write(`data: ${JSON.stringify({ type, text: line })}\n\n`);
        });
      };

      clients.set(clientId, res);
      send("info", "═══════════════════════════════════════");
      send("info", "🚀 AI QA Engine Starting...");
      send("info", `🌐 URL     : ${config.url}`);
      send("info", `📁 Project : ${config.project}`);
      send("info", "═══════════════════════════════════════");

      // Write config to task.config.ts
      const configContent = `
export const taskConfig = {
  url:     "${config.url}",
  project: "${config.project}",
  prompt:  \`${config.prompt}\`,
  output: {
    pageObject: "pages/GeneratedPage.page.ts",
    specFile:   "tests/generated/GeneratedPage.spec.ts",
    report:     "resources/reports/report.md",
  },
};
`.trim();

      fs.writeFileSync(path.join(__dirname, "task.config.ts"), configContent);

      // Run the engine
      const proc = spawn("npx", ["ts-node", "run.ts"], {
        cwd:   __dirname,
        shell: true,
        env:   { ...process.env },
      });

      proc.stdout.on("data", (data: Buffer) => {
        send("log", data.toString());
      });

      proc.stderr.on("data", (data: Buffer) => {
        const text = data.toString();
        if (!text.includes("ExperimentalWarning") && !text.includes("DeprecationWarning")) {
          send("warn", text);
        }
      });

      proc.on("close", (code: number) => {
        clients.delete(clientId);
        if (code === 0) {
          send("success", "═══════════════════════════════════════");
          send("success", "🎉 Engine completed successfully!");
          send("success", "📊 Open report: http://localhost:9323");
          send("success", "═══════════════════════════════════════");
        } else {
          send("error", `❌ Engine exited with code ${code}`);
        }
        res.write("data: {\"type\":\"done\"}\n\n");
        res.end();
      });

      req.on("close", () => {
        proc.kill();
        clients.delete(clientId);
      });
    });
    return;
  }

  // ── Get report ──────────────────────────────────────
  if (pathname === "/report" && req.method === "GET") {
    const project = (parsed.query.project as string) || "project-erp";
    const reportPath = path.join(__dirname, `../${project}/resources/reports/report.md`);
    if (fs.existsSync(reportPath)) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(fs.readFileSync(reportPath, "utf-8"));
    } else {
      res.writeHead(404);
      res.end("No report yet");
    }
    return;
  }

  // ── CORS preflight ──────────────────────────────────
  if (req.method === "OPTIONS") {
    res.writeHead(200, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, GET, OPTIONS" });
    res.end();
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║  🤖  Agentic QA Engine — UI Server       ║`);
  console.log(`║  👉  http://localhost:${PORT}               ║`);
  console.log(`║  Share with your team on the same WiFi   ║`);
  console.log(`╚══════════════════════════════════════════╝\n`);
});
