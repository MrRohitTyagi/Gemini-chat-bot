import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const generationConfig = {
  maxOutputTokens: 100,
  temperature: 0,
  topP: 0.1,
  topK: 16,
};

const KEY = process.env.GEMINI_KEY;
const genAI = new GoogleGenerativeAI(KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig,
});

export { model as GeminiModel };
