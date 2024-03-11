import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import NodeCache from "node-cache";
import {
  generateText,
  getins,
  getsummery,
  putins,
  putsummery,
} from "./gateways/genimi.js";
import { connectDB } from "./utils/db.js";


const app = express();
app.use(express.json());
app.use(cors({ origin: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));
app.options("*", cors());

dotenv.config();
connectDB();

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

app.get("/api/vi/get-summary", async (req, res) => {
  try {
    const [dec, ins] = await Promise.all([getsummery(), getins()]);

    const instructions = ins.text;
    const summery = dec.text;
    res.send({ instructions, summery });
  } catch (error) {}
});

app.put("/api/vi/put-summery", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text === "") {
      res.send({ success: false, msg: "text is empty" });
      return;
    }
    await putsummery(text);
    res.send({ success: true });
  } catch (error) {}
});

app.put("/api/vi/put-instruntions", async (req, res) => {
  try {
    console.log("req.body", req.body.text);
    const { text } = req.body;

    if (!text || text === "") {
      res.send({ success: false, msg: "text is empty" });
      return;
    }
    await putins(text);
    res.send({ success: true });
  } catch (error) {}
});

app.listen(5000, () => {
  // console.clear();
  console.log("server running at port 5000");
});
