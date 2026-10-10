import express from "express";
import orderController from "../controllers/order.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

// Middleware xác thực linh hoạt: nếu có Bearer token thì gán req.user
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    return verifyToken(req, res, next);
  }
  next();
};

// 1. Tạo đơn hàng mới
// Chuẩn RESTful: POST /
router.post("/", verifyToken, orderController.checkout);
// Tương thích ngược: POST /create
router.post("/create", optionalAuth, orderController.checkout);

// 2. Lấy danh sách đơn hàng
// Chuẩn RESTful: GET /my-orders
router.get("/my-orders", verifyToken, orderController.getMyOrders);
// Tương thích ngược với Dashboard: GET /user/:user_id
router.get("/user/:user_id", orderController.getOrdersByUserIdParam);

// 3. Xem chi tiết đơn hàng
// Tương thích ngược: GET /detail/:uuid
router.get("/detail/:uuid", orderController.getOrderDetail);
// Chuẩn RESTful: GET /:id
router.get("/:id", optionalAuth, orderController.getOrderDetail);

// 4. Thanh toán ảo: POST /pay/:uuid
router.post("/pay/:uuid", orderController.payOrder);

export default router;
