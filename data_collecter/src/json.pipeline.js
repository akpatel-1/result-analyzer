import fs from "fs";
import path from "path";
import client from "./auth/client.js";
import { jsonParser } from "./json.parser.js";
import { createJson } from "./createJson.js";
import { utils } from "./utils.js";

const BASE_URL = process.env.BASE_URL;

export async function jsonPipeline(inputUrl, batch, attempt_no, review_type, filepath) {
  const sourceData = JSON.parse(fs.readFileSync(filepath, "utf-8"));

  const outputDir = path.join("results", batch);
  fs.mkdirSync(outputDir, { recursive: true });

  const allResults = [];

  console.log(`\n🚀 Processing ${sourceData.length} records to ./${outputDir}/ ...\n`);

  for (const item of sourceData) {
    const roll_no = item.roll_no;
    const url = utils.buildResultUrl(inputUrl, roll_no);

    try {
      console.log(`📡 Fetching ${roll_no}...`);
      const response = await client.get(url, {
        headers: { Referer: `${BASE_URL}/WebApp/Result/SemesterResult.aspx` },
      });

      const rawData = jsonParser(response.data);

      if (!rawData || !Array.isArray(rawData.subjects)) {
        console.log(`⚠️  [${roll_no}] Page not found.`);
        continue;
      }

      const failedSubjects = item.failed_subjects || item.failed_subject_codes || [];
      if (failedSubjects.length > 0) {
        rawData.subjects = rawData.subjects.filter((subj) =>
          failedSubjects.includes(subj.code)
        );
      }

      if (rawData.subjects.length === 0) {
        console.log(`⚠️  [${roll_no}] No matching subjects after filtering.`);
        continue;
      }

      const validated = createJson(rawData, {
        batch,
        attempt_no,
        exam_type:   rawData.exam_type,   // from HTML: "Regular" | "Backlog"
        review_type: review_type,          // from prompt: "RTRV" | "RRV" | null
      });

      const file_roll_no = roll_no.toString().slice(-4);
      const filename = path.join(outputDir, `${file_roll_no}.json`);
      fs.writeFileSync(filename, JSON.stringify([validated], null, 2));

      allResults.push(validated);
      console.log(`✅ [${roll_no}] ${validated.name} | ${validated.exam_type} | review=${validated.review_type} | subjects=${validated.subjects.length}`);

    } catch (err) {
      console.log(`❌ [${roll_no}] Error: ${err.message}`);
    }
  }

  if (allResults.length > 0) {
    const combinedPath = path.join(outputDir, "1-allResults.json");
    fs.writeFileSync(combinedPath, JSON.stringify(allResults, null, 2));
    console.log(`\n📦 Combined: ${combinedPath} (${allResults.length} records)`);
  }

  console.log(`\n🎉 Done. Check '/${outputDir}'.`);
}