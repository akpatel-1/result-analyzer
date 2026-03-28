import { load } from "cheerio";

export function jsonParser(html) {
  const $ = load(html);
  const table = $("#GdUnReport");
  if (!table.length) return null;

  // --- Helpers ---
  // Strips noise chars (*, #, $) then parses integer
  const num = (el) => {
    const txt = $(el)
      .text()
      .replace(/\u00a0/g, "")
      .trim();
    if (!txt || txt.toUpperCase() === "ABS") return null;
    const match = txt.match(/-?\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  const str = (el) =>
    $(el)
      .text()
      .replace(/\u00a0/g, "")
      .trim() || null;

  // --- Header fields ---
  const roll_no = str($("#roll_no"));
  const name = str($("#NOC"));
  const branch = str($("#NOEx"));
  const enroll_id = str($("#enroll"));
  const abc_id = str($("#abcid"));

  if (!roll_no || !name || !branch) {
    console.error(`❌ [${roll_no}] Critical fields missing — skipping`);
    return null;
  }

  const exam_type = str($("#lblstat")) || "Regular";

  const semester = parseInt($("#sem").text().match(/\d+/)?.[0]) ?? null;
  const sessionRaw = $("#ext").text().trim();
  const exam_year = parseInt(sessionRaw.match(/\d{4}/)?.[0]) ?? null;
  let exam_session = sessionRaw;
  if (sessionRaw.toLowerCase().includes("apr")) exam_session = "Apr-May";
  else if (sessionRaw.toLowerCase().includes("nov")) exam_session = "Nov-Dec";

  const overall_status = $("#Result").text().trim();
  const overall_max = num($("#mxmarks")) || 0;
  const overall_obt = num($("#obtmarks")) || 0;
  const spiRaw = $("#spi").text().trim();
  const spi = spiRaw ? parseFloat(spiRaw) : null;

  const FAIL_GRADES = new Set(["F", "FF"]);

  const subjects = [];
  $("#GdUnReport tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 12) return;

    const code = str(cells.eq(1));
    if (!code) return;

    const grade = $(cells[11])
      .text()
      .replace(/[#$*]/g, "")
      .trim()
      .toUpperCase();

    subjects.push({
      code,
      name: str(cells.eq(2)),
      max_ese: num(cells.eq(3)),
      obt_ese: num(cells.eq(4)),
      max_ct: num(cells.eq(5)),
      obt_ct: num(cells.eq(6)),
      max_ta: num(cells.eq(7)),
      obt_ta: num(cells.eq(8)),
      max_total: num(cells.eq(9)),
      obt_total: num(cells.eq(10)),
      status: grade ? (FAIL_GRADES.has(grade) ? "Fail" : "Pass") : null,
    });
  });

  return {
    roll_no,
    name,
    enroll_id,
    abc_id,
    branch,
    exam_type,
    semester,
    exam_session,
    exam_year,
    spi,
    overall_max,
    overall_obt,
    overall_status,
    subjects,
  };
}
