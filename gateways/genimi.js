import boilerplateModel from "../models/boilerplate-model.js";
import dotenv from "dotenv";

dotenv.config();

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
