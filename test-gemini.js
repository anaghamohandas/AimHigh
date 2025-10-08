import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

async function testGemini() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("❌ Missing GEMINI_API_KEY in .env file");
    }

    console.log("🔑 API key loaded successfully.");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ✅ Use current model (for v1 endpoint)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    console.log("🤖 Sending request to Gemini...");
    const result = await model.generateContent("Write a 1-sentence motivational quote about AI learning.");
    console.log("✅ Gemini Response:", result.response.text());
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testGemini();
