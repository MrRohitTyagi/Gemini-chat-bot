import { GoogleGenerativeAI } from "@google/generative-ai";
import chatHistoryModel from "../models/chat-history-model.js";
import boilerplateModel from "../models/boilerplate-model.js";
import dotenv from "dotenv";

dotenv.config();

const KEY = process.env.GEMINI_KEY;

const genAI = new GoogleGenerativeAI(KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function getHistoryAndBoilerplate() {
  const chatHistoryPromise = chatHistoryModel.find().lean();
  const boilerplatePromise = boilerplateModel
    .find()
    .select("-_id -identifier -__v")
    .lean();

  const [chatHistory, boilerplate] = await Promise.all([
    chatHistoryPromise,
    boilerplatePromise,
  ]);

  return { chatHistory, boilerplate };
}

function combineHistoryAndBoilerplate(boilerplate, chatHistory) {
  const combinedHistory = chatHistory.reduce((arr, c) => {
    return arr.concat(...c.chatblock);
  }, []);

  return [...boilerplate, ...combinedHistory];
}

async function chatWithHistory(prompt, tries = 1, res) {
  if (tries > 3) throw new Error("Maximum tries surpassed");

  const { chatHistory, boilerplate } = await getHistoryAndBoilerplate();
  const finalHistory = combineHistoryAndBoilerplate(boilerplate, chatHistory);

  // return finalHistory;

  const chat = model.startChat({
    history: finalHistory,
    generationConfig: { maxOutputTokens: 100 },
  });

  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  let text = response.text();

  // if (!text) {
  //   text = await chatWithHistory(prompt, tries + 1);
  // }

  const chats = [
    { role: "user", parts: prompt },
    { role: "model", parts: text },
  ];

  res.send(text);
  await updateHistory(chats);
}

async function updateHistory(moreChats) {
  await chatHistoryModel.create({ chatblock: moreChats });
}

//to generate ony text

async function generateText(prompt) {
  const result = await model.generateContentStream(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

export { chatWithHistory, generateText };
