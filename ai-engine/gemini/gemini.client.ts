import * as dotenv from "dotenv";
import { spawnSync } from "child_process";
dotenv.config();

const GEMINI_API_KEY     = process.env.GEMINI_API_KEY     || "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

async function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

// ── 1. Gemini Direct API ────────────────────────────────────
async function tryGeminiAPI(prompt: string): Promise<string> {
  const models = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-2.5-flash"];
  for (const model of models) {
    try {
      console.log(`🤖 Trying Gemini API: ${model}`);
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const data = await res.json() as any;
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log(`✅ Gemini API responded: ${model}`);
        return data.candidates[0].content.parts[0].text;
      }
      if (data?.error?.code === 429) {
        console.log(`⚠️  Quota hit on ${model}. Trying next...`);
        continue;
      }
      throw new Error(data?.error?.message || "Unknown Gemini error");
    } catch (err: any) {
      if (err?.message?.includes("429") || err?.message?.includes("quota")) {
        console.log(`⚠️  Quota hit on ${model}. Trying next...`);
        continue;
      }
      console.log(`⚠️  ${model} error: ${err.message}`);
    }
  }
  throw new Error("All Gemini API models quota exhausted");
}

// ── 2. OpenRouter API ───────────────────────────────────────
async function tryOpenRouter(prompt: string): Promise<string> {
  const models = [
    "openrouter/free",                                    // ← auto-picks best free model
    "meta-llama/llama-3.3-70b-instruct:free",
    "deepseek/deepseek-chat:free",
    "mistralai/mistral-7b-instruct:free",
    "qwen/qwen-2.5-72b-instruct:free",
    "google/gemini-2.0-flash-thinking-exp:free",
  ];
  for (const model of models) {
    try {
      console.log(`🌐 Trying OpenRouter: ${model}`);
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/agentic-qa-engine",
          "X-Title": "Agentic QA Engine"
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 4000
        })
      });
      const data = await res.json() as any;
      if (data?.choices?.[0]?.message?.content) {
        console.log(`✅ OpenRouter responded: ${model}`);
        return data.choices[0].message.content;
      }
      if (data?.error?.code === 429) {
        console.log(`⚠️  OpenRouter quota on ${model}. Trying next...`);
        await sleep(2000);
        continue;
      }
      console.log(`⚠️  ${model} failed:`, data?.error?.message);
    } catch (err: any) {
      console.log(`⚠️  OpenRouter ${model} error: ${err.message}`);
    }
  }
  throw new Error("All OpenRouter models exhausted");
}

// ── 3. Gemini CLI ───────────────────────────────────────────
function tryGeminiCLI(prompt: string): string {
  console.log("🔄 Trying Gemini CLI...");
  const clean = prompt.replace(/\\r\\n/g, " ").replace(/\\n/g, " ").trim();
  const result = spawnSync("gemini.ps1", [], {
    input: clean,
    encoding: "utf8",
    timeout: 90000,
    shell: "powershell.exe",
    env: { ...process.env, PATH: `${process.env.APPDATA}\\\\npm;${process.env.PATH}` }
  });
  if (result.stdout?.trim()) {
    console.log("✅ Gemini CLI responded!");
    return result.stdout.trim();
  }
  throw new Error(`CLI failed: ${result.stderr}`);
}

// ── Main export ─────────────────────────────────────────────
export async function askGemini(prompt: string): Promise<string> {

  // 1. Try Gemini direct API
  if (GEMINI_API_KEY) {
    try { return await tryGeminiAPI(prompt); }
    catch (e: any) { console.log(`⚠️  Gemini API failed: ${e.message}`); }
  }

  // 2. Try OpenRouter (5 free models)
  if (OPENROUTER_API_KEY) {
    try { return await tryOpenRouter(prompt); }
    catch (e: any) { console.log(`⚠️  OpenRouter failed: ${e.message}`); }
  }

  // 3. Try Gemini CLI
  try { return tryGeminiCLI(prompt); }
  catch (e: any) { console.log(`⚠️  Gemini CLI failed: ${e.message}`); }

  throw new Error("❌ All AI options exhausted: Gemini API + OpenRouter + CLI all failed.");
}