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

  // Regular pipeline
  let review_type = null;
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
      review_type,
    );
  }

  // Backlog, RTRV, RRV pipeline
  attempt_no = await ask("Attempt number:→ ");
  if (type !== "Backlog") {
    review_type = type;
  }

  return await jsonPipeline(url, batch, attempt_no, review_type, filePath);
}
