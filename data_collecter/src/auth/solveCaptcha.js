import Tesseract from "tesseract.js";
import client from "./client.js";

const CAPTCHA_MAX_LENGTH = 6;
const MAX_RETRIES = 3;

function isValidCaptcha(text) {
  return /^[a-z0-9]+$/.test(text) && text.length <= CAPTCHA_MAX_LENGTH;
}

/**
 * Cleans raw OCR/LLM output down to lowercase alphanumeric.
 */
function cleanCaptchaText(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Downloads the CAPTCHA image and returns it as a base64 string and Buffer.
 */
async function downloadCaptcha() {
  console.log("🖼️  Downloading CAPTCHA...");
  const response = await client.get(process.env.CAPTCHA_URL, {
    responseType: "arraybuffer",
    headers: { Referer: process.env.LOGIN_URL },
  });
  const imageBuffer = Buffer.from(response.data);
  const base64Image = imageBuffer.toString("base64");
  return { imageBuffer, base64Image };
}

/**
 * Solves CAPTCHA using Tesseract OCR.
 */
async function solveWithTesseract(imageBuffer) {
  console.log("🔍 Attempting OCR with Tesseract...");
  const {
    data: { text },
  } = await Tesseract.recognize(imageBuffer, "eng", {
    tessedit_char_whitelist:
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    tessedit_pageseg_mode: "7",
  });
  return cleanCaptchaText(text);
}

/**
 * Main exported function.
 * Strategy:
 *   1. Try Tesseract OCR first (fast, free, local).
 *   2. Retry up to MAX_RETRIES times on fresh CAPTCHA images.
 *   3. Throw if all attempts are exhausted.
 */
export async function solveCaptcha() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`\n🔄 CAPTCHA attempt ${attempt}/${MAX_RETRIES}`);

    const { imageBuffer } = await downloadCaptcha();

    // --- Strategy 1: Tesseract ---
    let captchaText = await solveWithTesseract(imageBuffer);
    console.log(
      `   Tesseract raw result: "${captchaText}" (len=${captchaText.length})`,
    );

    if (isValidCaptcha(captchaText)) {
      console.log(`✅ CAPTCHA solved via OCR: "${captchaText}"`);
      return captchaText;
    }

    console.warn(
      `⚠️  OCR result "${captchaText}" failed validation ` +
        `(expected ${CAPTCHA_MAX_LENGTH} alphanumeric chars or fewer).`,
    );

    if (attempt < MAX_RETRIES) {
      console.log("🔁 Retrying with a fresh CAPTCHA image...");
    }
  }

  throw new Error(
    `❌ Failed to solve CAPTCHA after ${MAX_RETRIES} attempts. ` +
      `Check image quality or increase MAX_RETRIES.`,
  );
}
