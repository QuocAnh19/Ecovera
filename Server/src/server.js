import express from "express";
import cors from "cors";
import path from "path";
import ProductsRoute from "./Routes/Products/ProductsRoutes.js";

const app = express();

app.use(cors());

const __dirname = path.resolve();
app.use("/uploads", express.static("src/uploads"));

// Routes
app.use("/app/products", ProductsRoute);

// Khởi động
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
