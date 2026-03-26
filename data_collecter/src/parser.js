import { load } from "cheerio";

export function parseResultPage(html, exam_type, review_type) {
  const $ = load(html);
  const table = $("#GdUnReport");
  if (!table.length) return null;

  const name = $("#NOC").text().trim();
  const roll_no = $("#roll_no").text().trim();
  const enroll_id = $("#enroll").text().trim();
  const abc_id = $("#abcid").text().trim();
  const branch = $("#NOEx").text().trim();

  const semester_raw = $("#sem").text().trim();
  const semMatch = semester_raw.match(/^(\d+)/);
  const semester = semMatch ? parseInt(semMatch[1]) : null;

  const exam_session_raw = $("#ext").text().trim();
  const yearMatch = exam_session_raw.match(/(\d{4})$/);
  const exam_year = yearMatch ? parseInt(yearMatch[1]) : null;
  const sessionName = exam_session_raw
    .replace(/\s*\d{4}$/, "")
    .trim()
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("-");

  const obt_total_marks = parseInt($("#obtmarks").text().trim()) || 0;
  const max_total_marks = parseInt($("#mxmarks").text().trim()) || 0;
  const result_status = $("#Result").text().trim();

  const spiRaw = $("#spi").text().trim() || null;
  const spi = spiRaw ? parseFloat(spiRaw) : null;

  const subjects = [];

  $("#GdUnReport tbody tr").each((i, row) => {
    if (i < 2) return;
    const cells = $(row).find("td");
    if (cells.length < 11) return;

    const obtEseRaw = $(cells[4])
      .text()
      .replace(/\u00a0/g, "")
      .trim();
    const obtTotalRaw = $(cells[10])
      .text()
      .replace(/\u00a0/g, "")
      .trim();

    // review_type 1 = RTRV (#), 2 = RRV ($)
    if (review_type === 1) {
      if (!obtTotalRaw.includes("#")) return; // Skip if no #
    } else if (review_type === 2) {
      if (!obtTotalRaw.includes("$")) return; // Skip if no $
    } else if (exam_type === "Backlog") {
      if (!obtEseRaw.includes("*")) return; // Skip if no *
    }

    const num = (el) => {
      const txt = $(el)
        .text()
        .replace(/\u00a0/g, "")
        .trim();

      if (txt === "" || isNaN(txt)) return null;

      return parseInt(txt);
    };

    const str = (el) => {
      const txt = $(el)
        .text()
        .replace(/\u00a0/g, "")
        .trim();
      return txt === "" ? null : txt;
    };

    const codeRaw = str(cells[1]);
    if (!codeRaw) return;
    const code = codeRaw;

    const grade = str(cells[11]);
    const FAIL_GRADES = ["F", "FF"];
    const subjectStatus =
      grade === null
        ? null
        : FAIL_GRADES.includes(grade.toUpperCase())
          ? "Fail"
          : "Pass";

    subjects.push({
      code,
      name: str(cells[2]),
      max_ese: num(cells[3]),
      obt_ese: num(cells[4]),
      max_ct: num(cells[5]),
      obt_ct: num(cells[6]),
      max_ta: num(cells[7]),
      obt_ta: num(cells[8]),
      max_total: num(cells[9]),
      obt_total: num(cells[10]),
      status: subjectStatus,
    });
  });

  return {
    roll_no,
    name,
    enroll_id,
    abc_id,
    branch,
    semester,
    exam_session: sessionName,
    exam_year,
    spi,
    max_total_marks,
    obt_total_marks,
    overall_status: result_status,
    subjects,
  };
}
