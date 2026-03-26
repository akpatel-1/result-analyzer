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
  const batch = await ask("📅 Enter batch year :→ ");

  let exam_type, attempt_no, review_type;

  // To-Do 2: Conditional prompting based on URL
  const url = new URL(sampleUrl);
  const Type = url.searchParams.get("T");
  const RollNo = url.searchParams.get("R");
  const removed = RollNo.slice(0, -4);
  const semester = url.searchParams.get("S");

  const inputMode = await ask(
    "\n🧭 Choose roll input mode (1 = Range, 2 = Specific roll no.):→ ",
  );

  let startRollNo = null;
  let endRollNo = null;
  let rollNumbers = null;

  if (inputMode === "2") {
    const specificRaw = await ask(
      "📌 Enter specific roll no(last 4 digit) separated by ',' :→ ",
    );

    const parsed = specificRaw
      .split(",")
      .map((r) => r.trim())
      .filter((r) => /^\d{4}$/.test(r))
      .map((r) => removed + r);

    const uniqueRolls = [...new Set(parsed)];
    rollNumbers = uniqueRolls;
  } else {
    const startRollRaw = await ask(
      "📋 Enter last 4 digit of starting roll number:→ ",
    );
    const endRollRaw = await ask("📋 Enter last 4 digit ending roll number:→ ");
    startRollNo = removed + startRollRaw;
    endRollNo = removed + endRollRaw;
  }

  if (Type === "Regular") {
    exam_type = "Regular";
    attempt_no = 1;
    review_type = null;
    console.log(
      `\n⚡ exam_type = ${exam_type}, attempt_no = ${attempt_no} , review_type = ${review_type}`,
    );
  }

  if (Type === "Backlog") {
    exam_type = "Backlog";
    review_type = null;
    attempt_no = await ask("🔁 Enter attempt number (e.g. 1):→ ");
    console.log(
      `\n⚡ exam_type = ${exam_type}, attempt_no = ${attempt_no} , review_type = ${review_type}`,
    );
  }

  if (Type === "RTRV") {
    review_type = 1;
    const examTypeRaw = await ask("\n📚 Exam type (1=Regular, 2=Backlog):→ ");
    exam_type = examTypeRaw === "1" ? "Regular" : "Backlog";
    attempt_no =
      exam_type === "Regular"
        ? "1"
        : await ask("🔁 Enter attempt number (1,2,3):\n→ ");
    console.log(
      `\n⚡ exam_type = ${exam_type}, attempt_no = ${attempt_no} , review_type = ${review_type}`,
    );
  }

  if (Type === "RRV") {
    review_type = 2;
    const examTypeRaw = await ask(
      "\n📚 Exam type (1 = Regular, 2 = Backlog):→ ",
    );
    exam_type = examTypeRaw === "1" ? "Regular" : "Backlog";
    attempt_no =
      exam_type === "Regular"
        ? "1"
        : await ask("🔁 Enter attempt number (1,2,3):→ ");
    console.log(
      `\n⚡ exam_type = ${exam_type}, attempt_no = ${attempt_no} , review_type = ${review_type}`,
    );
  }

  return {
    sampleUrl,
    startRollNo,
    endRollNo,
    rollNumbers,
    batch,
    exam_type,
    attempt_no,
    review_type,
    semester,
  };
}
