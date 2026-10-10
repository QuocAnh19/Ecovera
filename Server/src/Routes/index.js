import express from "express";
import ProductRoutes from "./Products/ProductsRoutes.js";
import orderRouter from "./order.routes.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Gắn route sản phẩm
router.use("/products", ProductRoutes);

// Gắn orderRouter vào endpoint /api/orders và /orders
router.use("/api/orders", orderRouter);
router.use("/orders", orderRouter);

export default router;
