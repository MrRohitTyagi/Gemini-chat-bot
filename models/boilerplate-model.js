import mongoose from "mongoose";

const schema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  identifier: {
    enum: ["INS", "DEC"],
    type: String,
    required: true,
  },
});

const boilerplateModel = mongoose.model("boilerplate", schema);
export default boilerplateModel;
