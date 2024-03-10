import { GoogleGenerativeAI } from "@google/generative-ai";
import chatHistoryModel from "../models/chat-history-model.js";
// import boilerplateModel from "../models/boilerplate-model.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const KEY = process.env.GEMINI_KEY;

const genAI = new GoogleGenerativeAI(KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// async function getHistoryAndBoilerplate() {
//   const chatHistoryPromise = chatHistoryModel
//     .find()
//     .select("-chatblock._id")
//     .lean();
//   const boilerplatePromise = boilerplateModel
//     .find()
//     .select("-_id -identifier -__v")
//     .lean();

//   const [chatHistory, boilerplate] = await Promise.all([
//     chatHistoryPromise,
//     boilerplatePromise,
//   ]);

//   return { chatHistory, boilerplate };
// }

// function combineHistoryAndBoilerplate(boilerplate, chatHistory) {
//   const combinedHistory = chatHistory.reduce((arr, c) => {
//     return arr.concat(...c.chatblock);
//   }, []);

//   return [...boilerplate];
// }

// async function chatWithHistory(prompt, tries = 1, res) {
//   try {
//     const { chatHistory, boilerplate } = await getHistoryAndBoilerplate();
//     const finalHistory = combineHistoryAndBoilerplate(boilerplate, chatHistory);

//     // console.log("prompt", prompt);
//     // return res.send(finalHistory);

//     const chat = model.startChat({
//       history: finalHistory,
//       generationConfig: { maxOutputTokens: 100 },
//     });

//     const result = await chat.sendMessage(prompt);
//     const response = await result.response;
//     let text = response.text();

//     // if (!text) {
//     //   text = await chatWithHistory(prompt, tries + 1);
//     // }

//     const chats = [
//       { role: "user", parts: prompt },
//       { role: "model", parts: text },
//     ];

//     res.send(text);
//     await updateHistory(chats);
//   } catch (error) {
//     console.log("error", error);
//     res.status(400).send("Something went wrong please try again");
//   }
// }

//to generate ony text

const instructions = `based on above text, answer the following question ,reply like i(rohit) is answering to someone, answer professionally with no grammatical error  like you are answering in a interview ,only reply what is asked,\n
 strictly follow these rules \n
if the question is not relatable the no not answer and simply answer 'The question is Irrelevant try another question'\n
if some greets with hi,hello etc then greet them back`;

async function generateText(prompt, res) {
  try {
    const file = fs.readFileSync("./sample.txt", "utf8").toString();

    const fullPrompt = `${file} \n ${instructions} \n ${prompt}`;

    const result = await model.generateContentStream(fullPrompt);
    const response = await result.response;
    const text = response.text();
    res.send(text);
    updateHistory(prompt, text);
  } catch (error) {
    console.log("error", error);
    res.status(400).send("Something went wrong");
  }
}
async function updateHistory(question, answer) {
  await chatHistoryModel.create({ question, answer });
}
export {
  // chatWithHistory,
  generateText,
};
