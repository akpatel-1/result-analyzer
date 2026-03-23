import { fileURLToPath } from "node:url";
import { login } from "./src/auth/login.js";
import client from "./src/auth/client.js";
import { pipeline } from "./src/pipeline.js";

export async function orchestrator() {
  try {
    const isLoggedIn = await login.performLogin();
    if (!isLoggedIn) {
      console.error("❌ Stopping: login failed.");
      process.exitCode = 1;
      return;
    }

    await pipeline(client);
  } catch (error) {
    console.error("💥 Fatal error:", error.message);
    process.exitCode = 1;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await orchestrator();
}
