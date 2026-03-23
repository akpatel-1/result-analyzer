import "dotenv/config";
import { load } from "cheerio";
import { sha256 } from "js-sha256";
import { fileURLToPath } from "node:url";
import client from "./client.js";
import { solveCaptcha } from "./solveCaptcha.js";

export const login = {
  async performLogin() {
    try {
      const token = await this._getAntiForgeryToken();
      const captchaText = await solveCaptcha();

      const loginId = process.env.LOGIN_ID;
      const rawPassword = process.env.PASSWORD;
      const hashedPassword = sha256(rawPassword).toLowerCase();

      const formData = new URLSearchParams();
      formData.append("__RequestVerificationToken", token);
      formData.append("UserType", "Citizen");
      formData.append("LoginID", loginId);
      formData.append("password", hashedPassword);
      formData.append("captcha", captchaText);
      formData.append("CSCsubmit", "Login");

      console.log("🔐 Submitting login form...");
      const response = await client.post(
        process.env.LOGIN_URL,
        formData.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Referer: process.env.LOGIN_URL,
            Origin: process.env.BASE_URL,
          },
        },
      );

      const currentUrl = response.request?.res?.responseUrl || "";
      if (currentUrl.includes("/Account/Login")) {
        console.error("❌ Login failed");
        return false;
      }

      console.log("✅ Login successful! Session is active.");
      return true;
    } catch (error) {
      console.error("💥 Error during login:", error.message);
      return false;
    }
  },

  async _getAntiForgeryToken() {
    console.log(`🌐 Opening link: ${process.env.LOGIN_URL}`);
    const response = await client.get(process.env.LOGIN_URL);

    const $ = load(response.data);
    const token = $('input[name="__RequestVerificationToken"]').val();
    if (!token) throw new Error("Could not find verification token.");

    return token;
  },
};
