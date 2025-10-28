import express from "express";
const router = express.Router();

import ProductsController from "../../Controller/Products/ProductsController.js";

router.get("/", ProductsController.getAll);
router.get("/:id", ProductsController.getById);

export default router;
