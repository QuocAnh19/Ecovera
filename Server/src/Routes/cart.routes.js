import express from "express";
import cartController from "../controllers/cart.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

// Toàn bộ route giỏ hàng trên server yêu cầu đăng nhập
router.use(verifyToken);

router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.delete("/items/:productId", cartController.removeItem);
router.post("/merge", cartController.mergeCart);
router.delete("/", cartController.emptyCart);

export default router;
