import { GeminiModel } from "../utils/gemini.js";

export async function checkTokenCount(req, res, next) {
  const prompt = req.body.prompt;
  const { totalTokens } = await GeminiModel.countTokens(prompt);
  console.log("prompt", { prompt, totalTokens });

  if (totalTokens > 70) {
    return res.send({
      text: "Please shorten the question and try again",
      status: "400",
    });
  } else {
    req.prompt = prompt;
    next();
  }
}
