import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
