import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));
app.options("*", cors());

dotenv.config();
connectDB();

import { chatWithHistory } from "./gateways/genimi.js";
import { connectDB } from "./utils/db.js";

app.post("/api/v1/getresponse", async (req, res) => {
  try {
    const { prompt } = req.body;
    chatWithHistory(prompt, 1, res);
  } catch (error) {
    console.log("error", error);
    res
      .status(400)
      .send({ success: false, msg: error.message || "Something went wrong" });
  }
});

app.post("/generate/text", async (req, res) => {
  const { prompt } = req.body;
  const data = await generateText(prompt);
  res.send(data);
});

app.get("/", async (req, res) => {
  res.send({ success: true });
});

app.listen(5000, () => {
  // console.clear();
  console.log("server running at port 5000");
});
