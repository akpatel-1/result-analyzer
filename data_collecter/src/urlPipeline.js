import fs from "fs";
import path from "path";
import "dotenv/config";
import { utils } from "./utils.js";
import { parseResultPage } from "./urlParser.js";
import { createJson } from "./createJson.js";
import client from "./auth/client.js";

const BASE_URL = process.env.BASE_URL;

export async function urlPipeline(
  inputUrl,
  batch,
  startRollNo,
  endRollNo,
  attempt_no,
  review_type,
) {
  const rollNumbers = utils.generateRollNumbers(startRollNo, endRollNo);
  const outputDir = path.join("results", batch);
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(
    `\n🚀 Scraping ${rollNumbers.length} results to ./${outputDir}/ ...\n`,
  );

  const allResults = [];

  const CONCURRENCY_LIMIT = 10;

  const processRoll = async (roll) => {
    const url = utils.buildResultUrl(inputUrl, roll);
    try {
      const response = await client.get(url, {
        headers: { Referer: `${BASE_URL}/WebApp/Result/SemesterResult.aspx` },
      });

      const rawData = parseResultPage(response.data);

      if (!rawData) {
        console.log(`⚠️  [${roll}] No result found.`);
        return null;
      }

      if (rawData.subjects.length === 0) {
        console.log(`⚠️  [${roll}] Page loaded, but no subjects found.`);
        return null;
      }

      const finalJson = createJson(rawData, {
        batch,
        exam_type: "Regular",
        attempt_no,
        review_type,
      });

      let file_roll_no = roll.toString().slice(-4);
      const filename = path.join(outputDir, `${file_roll_no}.json`);
      fs.writeFileSync(filename, JSON.stringify([finalJson], null, 2));

      console.log(
        `✅ [${roll}] Saved: ${finalJson.name} (${finalJson.obt_total_marks}/${finalJson.max_total_marks})`,
      );
      return finalJson;
    } catch (err) {
      console.log(`❌ [${roll}] Error: ${err.message}`);
      return null;
    }
  };

  for (let i = 0; i < rollNumbers.length; i += CONCURRENCY_LIMIT) {
    const batch = rollNumbers.slice(i, i + CONCURRENCY_LIMIT);

    const batchResults = await Promise.all(
      batch.map((roll) => processRoll(roll)),
    );

    for (const result of batchResults) {
      if (result) allResults.push(result);
    }

    if (i + CONCURRENCY_LIMIT < rollNumbers.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  if (allResults.length > 0) {
    const combinedFilename = path.join(outputDir, "1-allResuts.json");
    fs.writeFileSync(combinedFilename, JSON.stringify(allResults, null, 2));
    console.log(
      `\n📦 Saved combined file: ${combinedFilename} (${allResults.length} records)`,
    );
  }

  console.log(`\n🎉 Scraping complete. Check the '/${outputDir}' folder.`);
}
