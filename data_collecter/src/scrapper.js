import fs from "fs";
import path from "path";
import "dotenv/config";
import { prompt } from "./prompt.js";
import { utils } from "./utils.js";
import { parseResultPage } from "./parser.js";
import { createJson } from "./createJson.js";

const BASE_URL = process.env.BASE_URL;

export async function runScraper(client) {
  const input = await prompt();

  const rollNumbers = utils.generateRollNumbers(
    input.startRollNo,
    input.endRollNo,
  );
  const outputDir = path.join("results", input.batch);
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(
    `\n🚀 Scraping ${rollNumbers.length} results to ./${outputDir}/ ...\n`,
  );

  for (let i = 0; i < rollNumbers.length; i++) {
    const roll = rollNumbers[i];
    const url = utils.buildResultUrl(input.sampleUrl, roll);

    try {
      const response = await client.get(url, {
        headers: { Referer: `${BASE_URL}/WebApp/Result/SemesterResult.aspx` },
      });
      const rawData = parseResultPage(response.data);

      if (!rawData) {
        console.log(`⚠️  [${roll}] No result found.`);
        continue;
      }

      const finalJson = createJson(rawData, input);

      const filename = path.join(outputDir, `${roll}.json`);
      fs.writeFileSync(filename, JSON.stringify(finalJson, null, 2));

      console.log(
        `✅ [${roll}] Saved: ${finalJson.name} (${finalJson.obt_total_marks}/${finalJson.max_total_marks})`,
      );
    } catch (err) {
      console.log(`❌ [${roll}] Error: ${err.message}`);
    }

    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\n🎉 Scraping complete. Check the '/${outputDir}' folder.`);
}
