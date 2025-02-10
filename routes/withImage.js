import { Router } from "express";
import { genWithImage } from "../gateways/with-Image.js";
import { checkTokenCount } from "../middleWare/tokenCount.js";
import { getInstructions } from "../middleWare/instructions.js";

const router = Router();

router.post("/", checkTokenCount, getInstructions, async (req, res) => {
  const data = await genWithImage({ res, req });
  res.send(data);
});
export default router;
