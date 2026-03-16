import * as dotenv from "dotenv";
dotenv.config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("\n🔍 Checking available models for your API key...\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );
  const data = await response.json() as any;

  if (data.error) {
    console.error("❌ API Key Error:", data.error.message);
    return;
  }

  console.log("✅ Available models:\n");
  data.models?.forEach((model: any) => {
    console.log(`→ ${model.name}`);
  });
}

listModels();