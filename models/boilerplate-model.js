import mongoose from "mongoose";

const schema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ["model", "user"],
  },
  parts: {
    type: String,
    required: true,
  },
  identifier: {
    enum: ["instructions", "description", "chat"],
    type: String,
    required: true,
  },
});

const boilerplateModel = mongoose.model("boilerplate", schema);
export default boilerplateModel;
