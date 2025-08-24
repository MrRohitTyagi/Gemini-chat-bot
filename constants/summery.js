import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function info() {
  const filePath = path.join(__dirname, "../sample.txt");
  return fs.readFileSync(filePath, "utf8");
}

const localSummary = info();

console.log(localSummary);

export { localSummary };
