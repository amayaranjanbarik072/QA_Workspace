import * as dotenv from "dotenv";
dotenv.config();

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("\n🔍 Testing API Key...");
  console.log(`🔑 Key starts with: ${apiKey?.substring(0, 10)}...`);

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey || "",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Say hello in one word" }],
            },
          ],
        }),
      }
    );

    const data = await response.json() as any;

    if (data.error) {
      console.error("\n❌ API Error:");
      console.error("Status :", data.error.code);
      console.error("Message:", data.error.message);
      console.error("Status :", data.error.status);
      return;
    }

    console.log("\n✅ Gemini is working!");
    console.log("Response:", data.candidates[0].content.parts[0].text);

  } catch (error) {
    console.error("\n❌ Network Error:", error);
  }
}

testGemini();