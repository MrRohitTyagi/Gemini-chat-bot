import * as fs from "node:fs";
import { GeminiModel } from "../utils/gemini.js";

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}
const imagePart = fileToGenerativePart("../backend/resume.png", "image/png");

export async function genWithImage({ req, res }) {
  const finalPrompt = `${req.instructions} \n ${req.prompt}`;
  const result = await GeminiModel.generateContent([finalPrompt, imagePart]);
  return result.response.text();
}
