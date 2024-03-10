import mongoose from "mongoose";

const schema = new mongoose.Schema({
  question: { type: "String" },
  answer: { type: "String" },
});

const chatHistoryModel = mongoose.model("chat-history", schema);
export default chatHistoryModel;
