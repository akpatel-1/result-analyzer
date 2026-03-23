import Tesseract from "tesseract.js";
import client from "./client.js";

export async function solveCaptcha() {
  console.log("🖼️  Downloading CAPTCHA...");
  const response = await client.get(process.env.CAPTCHA_URL, {
    responseType: "arraybuffer",
    headers: { Referer: process.env.LOGIN_URL },
  });

  const imageBuffer = Buffer.from(response.data);

  console.log("🔍 Solving CAPTCHA with OCR...");
  const {
    data: { text },
  } = await Tesseract.recognize(imageBuffer, "eng", {
    tessedit_char_whitelist:
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    tessedit_pageseg_mode: "7",
  });

  const captchaText = text.trim().toLowerCase().replace(/\s+/g, "");
  console.log(`✅ CAPTCHA solved as: "${captchaText}"`);
  return captchaText;
}
