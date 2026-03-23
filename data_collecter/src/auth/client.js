import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

// Create a cookie jar to hold session data
const cookieJar = new CookieJar();

// Wrap axios to automatically manage cookies
const client = wrapper(
  axios.create({
    jar: cookieJar,
    withCredentials: true,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  }),
);

export default client;
