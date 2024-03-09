import mongoose from "mongoose";

const schema = new mongoose.Schema({
  chatblock: {
    type: [
      {
        role: {
          type: String,
          required: true,
          enum: ["model", "user"],
        },
        parts: {
          type: String,
          required: true,
        },
      },
    ],
  },
});

const chatHistoryModel = mongoose.model("chat-history", schema);
export default chatHistoryModel;
