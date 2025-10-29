import express from "express";
import cors from "cors";
import path from "path";

import routes from "./Routes/index.js";
import authRoutes from "./Routes/Auth/Auth.js";
import loginRoutes from "./Routes/Auth/Login.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

// const paymentRoutes = require("./routes/payment");
// app.use(paymentRoutes);

app.use("/app", routes);

app.use("/api", authRoutes);
app.use("/api", loginRoutes);

export default app;
