import "dotenv/config";
import { app } from "./app.js";

const PORT = process.env.PORT;

app.listen(PORT, (req, res) => {
  console.log("Server start running...");
});
