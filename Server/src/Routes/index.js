import express from "express";

import ProductRoutes from "./Products/ProductsRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.use("/products", ProductRoutes);

export default router;
