import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// import { connectDB } from "./utils/db.js";

import { generateAIresponse } from "./gateways/geminiV2.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));
app.options("*", cors());

dotenv.config();
// connectDB();

//NEW

app.post("/api/v3/response", async (req, res) => {
  const { prompt } = req.body;
  const response = await generateAIresponse(prompt);

  res.status(200).send({
    response: response,
  });
});

app.get("/api/v3/online", async (req, res) => {
  res.status(200).send({
    response: true,
  });
});
//NEW

app.get("/", async (req, res) => {
  res.status(200).send({
    response: true,
    msg: "Server is running fine",
  });
});

app.listen(5000, () => {
  // console.clear();
  console.log("server running at port 5000");
});
