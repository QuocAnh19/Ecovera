import express from "express";
import productsRoutes from "./Products/ProductsRoutes.js";

const router = express.Router();

router.use("/products", productsRoutes);

export default router;
