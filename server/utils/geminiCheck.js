import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function checkForSlang(text) {
  const prompt = `
You are a content moderation AI for a university discussion board.
Users post in Bangla, English, or Banglish.

Allow:
- Complaints, criticism, negative feedback
- Reports of harassment
- Academic discussion

Reject:
- Slang, swear words, insults
- Sexual or objectifying comments
- Disrespectful personal attacks

Respond ONLY with:
OK
or
SLANG

Analyze this text:
"${text}"
`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const output = result.text?.trim().toLowerCase() || "";
    if (output.includes("slang")) return "BLOCKED";
    return "OK";
  } catch (err) {
    console.error("Gemini moderation failed:", err.message);
    return "ERROR";
  }
}
