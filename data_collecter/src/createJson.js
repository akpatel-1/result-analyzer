import { utils } from "./utils.js";
import { ResultSchema } from "./schema.js";

export function createJson(rawData, input) {
  let sessionString = rawData.exam_session;
  if (sessionString.toLowerCase().includes("apr")) sessionString = "Apr-May";
  if (sessionString.toLowerCase().includes("nov")) sessionString = "Nov-Dec";

  const unvalidatedData = {
    roll_no: rawData.roll_no,
    name: rawData.name,
    email: utils.buildEmail(rawData.name, input.batch),
    enroll_id: rawData.enroll_id || null,
    abc_id: rawData.abc_id || null,
    batch: parseInt(input.batch) || null,
    branch: rawData.branch,
    semester: rawData.semester,
    exam_session: sessionString,
    exam_year: rawData.exam_year,
    exam_type: input.exam_type,
    attempt_no: parseInt(input.attempt_no) || 1,
    view_type: input.view_type,
    spi: rawData.spi,
    overall_max: rawData.overall_max,
    overall_obt: rawData.overall_obt,
    overall_status: rawData.overall_status,
    result_date: rawData.result_date,
    subjects: rawData.subjects,
  };

  try {
    console.log("Parsing");
    return ResultSchema.parse(unvalidatedData);
  } catch (error) {
    const issues = error?.issues ?? error?.errors;
    if (!Array.isArray(issues)) {
      throw error;
    }
    const errorDetails = issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(" | ");
    throw new Error(`Zod Validation Failed -> ${errorDetails}`);
  }
}
