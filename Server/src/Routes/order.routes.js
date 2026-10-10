import express from "express";
import orderController from "../controllers/order.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);
router.post("/", orderController.checkout);
router.get("/my-orders", orderController.getMyOrders);
router.get("/:id", orderController.getOrderDetail);

export default router;
