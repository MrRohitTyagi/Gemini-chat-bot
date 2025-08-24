import { GoogleGenAI } from "@google/genai";
import { localInstruction } from "../constants/instruction.js";
import { localSummary } from "../constants/summery.js";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});
console.log("process.env", process.env.GEMINI_KEY);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

function structureHistory(history) {
  return history.map((message) => ({
    role: message.role,
    parts: [{ text: message.parts }],
  }));
}

async function withHistory(prompt, history) {
  const chatHistory = structureHistory(history);
  console.log("chatHistory", chatHistory);
  const chat = ai.chats.create({
    config: {
      systemInstruction: localInstruction + "\n\n" + localSummary,
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
    model: "gemini-2.5-flash",
    history: chatHistory,
  });
  const res = await chat.sendMessage({
    message: prompt,
  });
  console.log("res", res.text);
  return res.text;
}

async function generateAIresponse(prompt, history) {
  return withHistory(prompt, history);
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
