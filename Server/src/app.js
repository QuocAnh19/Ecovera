import express from "express";
import cors from "cors";
import path from "path";

import routes from "./Routes/index.js";
import loginRoutes from "./Routes/Auth/Login.js";
import OrderRoutes from "./Routes/Payment/OrderRoutes.js";
import RegisterRoutes from "./Routes/Auth/Register.js";
import userRoutes from "./Routes/User/UsersRoutes.js";
import AdminRoutes from "./Routes/Admin/AdminRoutes.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));
app.use("/app", routes);

app.use("/api", RegisterRoutes);
app.use("/api", loginRoutes);

app.use("/api/orders", OrderRoutes);

app.use("/api/users", userRoutes);

app.use("/api/admin", AdminRoutes);

export default app;
