import readline from "readline";

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function prompt() {
  const sampleUrl = await ask("🔗 Paste a result page URL:\n→ ");
  const startRollRaw = await ask(
    "\n📋 Enter last 4 digit of starting roll number:\n→ ",
  );
  const endRollRaw = await ask("📋 Enter last 4 digit ending roll number:\n→ ");
  const batch = await ask("📅 Enter batch year :\n→ ");

  let exam_type, attempt_no, review_type;

  // To-Do 2: Conditional prompting based on URL
  const url = new URL(sampleUrl);
  const Type = url.searchParams.get("T");
  const RollNo = url.searchParams.get("R");
  const removed = RollNo.slice(0, -4);
  const startRollNo = removed + startRollRaw;
  const endRollNo = removed + endRollRaw;

  if (Type === "Regular") {
    exam_type = "Regular";
    attempt_no = 1;
    review_type = null;
    console.log(
      "\n⚡ exam_type = Regular, attempt_no = 1 , review_type = null",
    );
  }

  if (Type === "Backlog") {
    exam_type = "Backlog";
    review_type = null;
    attempt_no = await ask("🔁 Enter attempt number (e.g. 1):\n→ ");
    console.log(
      `\n⚡ exam_type = Backlog, attempt_no = ${attempt_no} , review_type = null`,
    );
  }

  if (Type === "RTRV") {
    review_type = 1;
    const examTypeRaw = await ask("\n📚 Exam type (1=Regular, 2=Backlog):\n→ ");
    exam_type = examTypeRaw === "1" ? "Regular" : "Backlog";
    attempt_no =
      exam_type === "Regular"
        ? "1"
        : await ask("🔁 Enter attempt number (1,2,3):\n→ ");
  }

  if (Type === "RRV") {
    review_type = 2;
    const examTypeRaw = await ask(
      "\n📚 Exam type (1 = Regular, 2 = Backlog):\n→ ",
    );
    exam_type = examTypeRaw === "1" ? "Regular" : "Backlog";
    attempt_no =
      exam_type === "Regular"
        ? "1"
        : await ask("🔁 Enter attempt number (1,2,3):\n→ ");
  }

  return {
    sampleUrl,
    startRollNo,
    endRollNo,
    batch,
    exam_type,
    attempt_no,
    review_type,
  };
}
