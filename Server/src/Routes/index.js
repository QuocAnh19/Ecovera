import express from "express";

import ProductRoutes from "./Products/ProductsRoutes.js";

const router = express.Router();

router.use("/products", ProductRoutes);

export default router;
