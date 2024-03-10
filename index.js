import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { readFileSync, writeFileSync } from "fs";
const app = express();
app.use(express.json());
app.use(cors({ origin: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));
app.options("*", cors());

dotenv.config();
connectDB();

import { generateText } from "./gateways/genimi.js";
import { connectDB } from "./utils/db.js";

app.post("/api/v1/getresponse", async (req, res) => {
  try {
    const { prompt } = req.body;
    // chatWithHistory(prompt, 1, res);
    generateText(prompt, res);
  } catch (error) {
    console.log("error", error);
    res
      .status(400)
      .send({ success: false, msg: error.message || "Something went wrong" });
  }
});

app.post("/api/v1/generate/text", async (req, res) => {
  const { prompt } = req.body;
  await generateText(prompt, res);
});

app.get("/", async (req, res) => {
  res.send({ success: true });
});

app.get("/api/vi/get-bio", async (req, res) => {
  try {
    const file = readFileSync("./sample.txt", "utf8").toString();
    res.send(file);
  } catch (error) {}
});

app.put("/api/vi/put-bio", async (req, res) => {
  try {
    console.log("req.body", req.body.text);
    const { text } = req.body;
    if (!text || text === "") {
      res.send({ success: false, msg: "text is empty" });
      return;
    }
    writeFileSync("./sample.txt", text);
    res.send({ success: true });
  } catch (error) {}
});

app.listen(5000, () => {
  // console.clear();
  console.log("server running at port 5000");
});
