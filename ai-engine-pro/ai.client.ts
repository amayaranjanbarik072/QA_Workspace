/// <reference lib="dom" />
// ══════════════════════════════════════════════════════════
//  AI Client — tries all providers automatically
//  Priority: Gemini API → OpenRouter → Gemini CLI
// ══════════════════════════════════════════════════════════

import { spawnSync } from "child_process";
import * as dotenv from "dotenv";
dotenv.config();

const GEMINI_KEY     = process.env.GEMINI_API_KEY     || "";
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || "";

const GEMINI_MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
];

const OPENROUTER_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-chat-v3-0324:free",
  "deepseek/deepseek-r1-zero:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "nvidia/llama-3.1-nemotron-nano-8b-v1:free",
];

// ── Provider 1: Gemini direct API ──────────────────────────
async function tryGemini(prompt: string): Promise<string> {
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await res.json() as any;
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        console.log(`   ✅ Gemini API [${model}]`);
        return text;
      }
      if (data?.error?.code === 429) {
        console.log(`   ⚠️  Quota: ${model}`);
        continue;
      }
    } catch { continue; }
  }
  throw new Error("Gemini quota exhausted");
}

// ── Provider 2: OpenRouter (free models) ───────────────────
async function tryOpenRouter(prompt: string): Promise<string> {
  for (const model of OPENROUTER_MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://agentic-qa-engine",
          "X-Title": "Agentic QA Engine",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 8000,
        }),
      });
      const data = await res.json() as any;
      const text = data?.choices?.[0]?.message?.content;
      if (text) {
        console.log(`   ✅ OpenRouter [${model}]`);
        return text;
      }
      console.log(`   ⚠️  ${model}: ${data?.error?.message || "no response"}`);
    } catch { continue; }
  }
  throw new Error("OpenRouter exhausted");
}

// ── Provider 3: Gemini CLI (uses your Google account) ──────
function tryGeminiCLI(prompt: string): string {
  const clean = prompt.replace(/[\r\n]+/g, " ").trim();
  const result = spawnSync("gemini.ps1", [], {
    input: clean,
    encoding: "utf8",
    timeout: 120000,
    shell: "powershell.exe",
    env: { ...process.env, PATH: `${process.env.APPDATA}\\npm;${process.env.PATH}` },
  });
  if (result.stdout?.trim()) {
    console.log("   ✅ Gemini CLI");
    return result.stdout.trim();
  }
  throw new Error(`CLI: ${result.stderr || "no output"}`);
}

// ── Main export ─────────────────────────────────────────────
export async function askAI(prompt: string): Promise<string> {
  if (GEMINI_KEY) {
    try { return await tryGemini(prompt); } catch { }
  }
  if (OPENROUTER_KEY) {
    try { return await tryOpenRouter(prompt); } catch { }
  }
  try { return tryGeminiCLI(prompt); } catch { }

  throw new Error("❌ All AI providers failed. Check your API keys in .env");
}
