import { load } from "cheerio";

export function parseResultPage(html) {
  const $ = load(html);
  const table = $("#GdUnReport");
  if (!table.length) return null;

  const name = $("#NOC").text().trim();
  const roll_no = $("#roll_no").text().trim();
  const enroll_id = $("#enroll").text().trim();
  const abc_id = $("#abcid").text().trim();
  const branch = $("#NOEx").text().trim();

  const semester = parseInt($("#sem").text().match(/\d+/)?.[0]) ?? null;

  const examSessionRaw = $("#ext").text().trim();
  const exam_year = parseInt(examSessionRaw.match(/\d{4}/)?.[0]) ?? null;
  let exam_session = examSessionRaw;
  if (examSessionRaw.toLowerCase().includes("apr")) exam_session = "Apr-May";
  else if (examSessionRaw.toLowerCase().includes("nov"))
    exam_session = "Nov-Dec";

  const overall_status = normalizeRegularOverallStatus(
    $("#Result").text().trim(),
  );
  const overall_obt = parseInt($("#obtmarks").text().trim()) || 0;
  const overall_max = parseInt($("#mxmarks").text().trim()) || 0;
  const result_date = $("#rcreateona").text().trim() || null;

  const spiRaw = $("#spi").text().trim() || null;
  const spi = spiRaw ? parseFloat(spiRaw) : null;

  const subjects = [];

  $("#GdUnReport tbody tr").each((i, row) => {
    if (i < 2) return;
    const cells = $(row).find("td");
    if (cells.length < 12) return;

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

    const code = str(cells[1]);
    if (!code) return;

    const grade = str(cells[11]);
    const FAIL_GRADES = ["F", "FF"];
    const status =
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
      status,
    });
  });

  return {
    roll_no,
    name,
    enroll_id,
    abc_id,
    branch,
    semester,
    exam_session,
    exam_year,
    spi,
    result_date,
    overall_max,
    overall_obt,
    overall_status,
    subjects,
  };
}

function normalizeRegularOverallStatus(rawStatus) {
  const status = (rawStatus || "").trim().toLowerCase();
  if (!status) return "Fail";
  if (status.includes("fail")) return "Fail";
  if (status.includes("grace")) return "Pass By Grace";
  return "Pass";
}
