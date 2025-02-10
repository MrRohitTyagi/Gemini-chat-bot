import NodeCache from "node-cache";
import boilerplateModel from "../models/boilerplate-model.js";
import { localInstruction } from "../constants/instruction.js";

const myCache = new NodeCache({ stdTTL: 24 * 60 });

export async function getInstructions(req, res, next) {
  try {
    let instructions;
    const cacheInstructions = myCache.get("instructions");

    if (!cacheInstructions) {
      const ins = await getins();

      instructions = ins.text;

      myCache.set("instructions", ins.text);
    } else {
      instructions = cacheInstructions;
    }

    req.instructions = instructions;
    next();
  } catch (error) {
    req.instructions = localInstruction;
    next();
  }
}
function getins() {
  return boilerplateModel
    .findOne({ identifier: "INS" })
    .lean()
    .select("text -_id");
}
