import express from "express";
import cartController from "../controllers/cart.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

// Bảo vệ toàn bộ route giỏ hàng bằng authMiddleware (verifyToken)
router.use(verifyToken);

// 1. Lấy thông tin giỏ hàng kèm tổng tiền: GET /
router.get("/", cartController.getCart);

// 2. Thêm sản phẩm vào giỏ: POST /items hoặc POST /
router.post("/items", cartController.addToCart);
router.post("/", cartController.addToCart);

// 3. Cập nhật số lượng của một mục: PUT /items/:cartItemId hoặc PATCH /items/:cartItemId
router.put("/items/:cartItemId", cartController.updateQuantity);
router.patch("/items/:cartItemId", cartController.updateQuantity);

// 4. Xóa một sản phẩm khỏi giỏ: DELETE /items/:cartItemId
router.delete("/items/:cartItemId", cartController.removeItem);

// 5. Gộp giỏ hàng LocalStorage khi đăng nhập: POST /merge
router.post("/merge", cartController.mergeCart);

// 6. Xóa sạch toàn bộ giỏ hàng: DELETE /
router.delete("/", cartController.clearCart);

export default router;
