import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Ecovera Server running at http://localhost:${PORT}`);
  console.log(`🕒 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`===============================================`);
});
