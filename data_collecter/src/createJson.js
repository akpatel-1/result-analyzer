import { utils } from "./utils.js";

export function createJson(rawData, input) {
  const finalJson = {
    roll_no: rawData.roll_no,
    name: rawData.name,
    email: utils.buildEmail(rawData.name, input.batch),
    enroll_id: rawData.enroll_id,
    abc_id: rawData.abc_id,
    batch: input.batch,
    branch: rawData.branch,
    semester: rawData.semester,
    exam_session: rawData.exam_session,
    exam_year: rawData.exam_year,
    exam_type: input.exam_type,
    attempt_no: input.attempt_no,
    review_type: input.review_type,
    spi: rawData.spi,
    max_total_marks: rawData.max_total_marks,
    obt_total_marks: rawData.obt_total_marks,
    status: rawData.status,
    subjects: rawData.subjects,
  };
  return finalJson;
}
