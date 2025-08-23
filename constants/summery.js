import fs from "fs";

function info() {
  return fs.readFileSync("sample.txt", "utf8");
}

const localSummary = info();


export { localSummary };
