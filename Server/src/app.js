import express from "express";
import cors from "cors";
import path from "path";
import routes from "./Routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

app.use("/app", routes);

export default app;
