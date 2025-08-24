import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// import { connectDB } from "./utils/db.js";

import { generateAIresponse } from "./gateways/geminiV2.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));
app.options("*", cors());

dotenv.config({ path: ".env" });
// connectDB();

//NEW
app.post("/api/v3/response", async (req, res) => {
  try {
    const { prompt, history } = req.body;
    const response = await generateAIresponse(prompt, history);
    res.status(200).json({
      response: response,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/v3/online", async (req, res) => {
  try {
    res.status(200).json({
      response: true,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//NEW

app.get("/", async (req, res) => {
  res.status(200).send({
    response: true,
    msg: "Server is running fine",
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
export default app;
