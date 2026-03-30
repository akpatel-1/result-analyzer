import fs from "fs";
import path from "path";
import client from "./auth/client.js";
import { jsonParser } from "./json.parser.js";
import { createJson } from "./createJson.js";
import { utils } from "./utils.js";

const BASE_URL = process.env.BASE_URL;

export async function jsonPipeline(
  inputUrl,
  batch,
  attempt_no,
  view_type,
  filepath,
  exam_type,
  semester,
) {
  const sourceData = JSON.parse(fs.readFileSync(filepath, "utf-8"));

  const filename = `${batch} ${semester} ${exam_type}-${attempt_no} ${view_type}`;
  const outputDir = path.join("results", filename);
  fs.mkdirSync(outputDir, { recursive: true });

  const allResults = [];

  console.log(
    `\n🚀 Processing ${sourceData.length} records to ./${outputDir}/ ...\n`,
  );

  for (const item of sourceData) {
    const roll_no = item.roll_no;
    const url = utils.buildResultUrl(inputUrl, roll_no);

    try {
      console.log(`📡 Fetching ${roll_no}...`);
      const response = await client.get(url, {
        headers: { Referer: `${BASE_URL}/WebApp/Result/SemesterResult.aspx` },
      });

      const rawData = jsonParser(response.data);

      if (!rawData) {
        console.log(`⚠️  [${roll_no}] No result found.`);
        continue;
      }

      const failedSubjects = item.failed_subjects;
      if (failedSubjects.length > 0) {
        rawData.subjects = rawData.subjects.filter((subj) =>
          failedSubjects.includes(subj.code),
        );
      }

      if (rawData.subjects.length === 0) {
        console.log(`⚠️  [${roll_no}] No matching subjects after filtering.`);
        continue;
      }

      const validated = createJson(rawData, {
        batch,
        attempt_no,
        exam_type: rawData.exam_type, // from HTML: "Regular" | "Backlog"
        view_type: view_type, // from prompt: "RTRV" | "RRV" | "VALUATION"
      });

      const file_roll_no = roll_no.toString().slice(-4);
      const filename = path.join(outputDir, `${file_roll_no}.json`);
      fs.writeFileSync(filename, JSON.stringify([validated], null, 2));

      allResults.push(validated);
      console.log(
        `✅ [${roll_no}] ${validated.name} | ${validated.exam_type} | review=${validated.view_type} | subjects=${validated.subjects.length}`,
      );
    } catch (err) {
      console.log(`❌ [${roll_no}] Error: ${err.message}`);
    }
  }

  if (allResults.length > 0) {
    const finalFilename = `${batch}_${semester}_${exam_type}-${attempt_no}_${view_type}.json`;
    const combinedPath = path.join(outputDir, finalFilename);
    fs.writeFileSync(combinedPath, JSON.stringify(allResults, null, 2));
    console.log(
      `\n📦 Combined: ${combinedPath} (${allResults.length} records)`,
    );
  }

  console.log(
    `\n🎉 ${batch} | ${semester} | ${exam_type}-${attempt_no} | ${view_type} ---> saved at '/${outputDir}'.`,
  );
}
