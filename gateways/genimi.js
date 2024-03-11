import { GoogleGenerativeAI } from "@google/generative-ai";
import chatHistoryModel from "../models/chat-history-model.js";
import boilerplateModel from "../models/boilerplate-model.js";
import dotenv from "dotenv";

import NodeCache from "node-cache";
const myCache = new NodeCache({ stdTTL: 24 * 60 });

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
  model: "gemini-pro",
  generationConfig,
});

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

// const instructions = `based on above text, answer the following question ,reply like i(rohit) is answering to someone, answer professionally with no grammatical error  like you are answering in a interview ,only reply what is asked,\n
//  strictly follow these rules \n
// if the question is not relatable the no not answer and simply answer 'The question is Irrelevant try another question'\n
// if some greets with hi,hello etc then greet them back`;

async function generateText(prompt, res) {
  try {
    const { totalTokens } = await model.countTokens(prompt);
    // const summery = fs.readFileSync("./sample.txt", "utf8").toString();
    // const file = await boilerplateModel.findOne({ identifier: "DEC" });
    // const file = await boilerplateModel.create({
    //   identifier: "INS",
    //   text: instructions,
    // });
    let instructions;
    let summery;
    if (totalTokens > 70) {
      return res.send("Please shorten the question and try again");
    }

    const cacheinstructions = myCache.get("instructions");
    const cachesummery = myCache.get("summery");

    if (!cachesummery || !cacheinstructions) {
      const [dec, ins] = await Promise.all([getsummery(), getins()]);
      console.log("INSIDE");
      instructions = ins.text;
      summery = dec.text;

      myCache.set("instructions", ins.text);
      myCache.set("summery", dec.text);
    } else {
      console.log("OUTSIDE");
      instructions = cacheinstructions;
      summery = cachesummery;
    }

    const fullPrompt = `${summery} \n ${instructions} \n ${prompt} ?`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();
    res.send(text);
    updateHistory(prompt, text);
  } catch (error) {
    console.log("error", error);
    res.status(400).send(error.message || "Something went wrong");
  }
}
async function updateHistory(question, answer) {
  await chatHistoryModel.create({ question, answer });
}
export {
  // chatWithHistory,
  generateText,
};

export function getsummery() {
  return boilerplateModel
    .findOne({ identifier: "DEC" })
    .lean()
    .select("text -_id");
}
export function getins() {
  return boilerplateModel
    .findOne({ identifier: "INS" })
    .lean()
    .select("text -_id");
}

export async function putsummery(text) {
  return await boilerplateModel.findOneAndUpdate(
    { identifier: "DEC" },
    { text }
  );
}
export async function putins(text) {
  return await boilerplateModel.findOneAndUpdate(
    { identifier: "INS" },
    { text }
  );
}

function clearcache() {
  console.log("CLEARED");
  myCache.set("instructions", "");
  myCache.set("summery", "");
}
// setTimeout(() => {
//   clearcache();
// }, 1000);
