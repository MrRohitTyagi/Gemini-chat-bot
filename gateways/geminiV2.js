import { GoogleGenAI } from "@google/genai";
import { localInstruction } from "../constants/instruction.js";
import { localSummary } from "../constants/summery.js";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

async function generateAIresponse(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${localSummary}\n\n${prompt}`,
    config: {
      systemInstruction: localInstruction,
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });
  console.log(response.text);
  return response.text;
}

export { generateAIresponse };
