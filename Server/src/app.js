import express from "express";
import cors from "cors";
import routes from "./Routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/app", routes);

export default app;
