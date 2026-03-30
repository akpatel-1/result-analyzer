import readline from "readline";
import { fileURLToPath } from "node:url";
import { urlPipeline } from "./urlPipeline.js";
import { jsonPipeline } from "./json.pipeline.js";

const filePath = fileURLToPath(new URL("./json/file.json", import.meta.url));

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans.trim());
    }),
  );
}

export async function prompt() {
  const url = await ask("🔗 Paste URL:\n→ ");
  const batch = await ask("Batch year:→ ");

  const params = new URL(url).searchParams;
  const type = params.get("T");
  const rawSem = params.get("S");
  const semester = "S" + rawSem.match(/\d+/)[0];

  // Regular pipeline
  let view_type = "VALUATION";
  let attempt_no = 1;
  if (type === "Regular") {
    let base = params.get("R").slice(0, -4);

    let startRollNo = base + (await ask("Starting Roll_No last 4 digits:→ "));
    let endRollNo = base + (await ask("Ending Roll_No last 4 digits:→ "));
    return await urlPipeline(
      url,
      batch,
      startRollNo,
      endRollNo,
      attempt_no,
      view_type,
      "Regular",
      semester,
    );
  }

  // Backlog, RTRV, RRV pipeline
  let exam_type = "Backlog";
  if (type != "Backlog") {
    const input = await ask("Exam type (1 → Regular & 2 → Backlog): ");
    const examMap = {
      1: "Regular",
      2: "Backlog",
    };
    exam_type = examMap[input];
  }

  if (exam_type === "Backlog") {
    attempt_no = await ask("Attempt number:→ ");
  }

  if (type !== "Backlog") {
    view_type = type;
  }

  return await jsonPipeline(
    url,
    batch,
    attempt_no,
    view_type,
    filePath,
    exam_type,
    semester,
  );
}
