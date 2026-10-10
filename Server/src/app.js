import express from "express";
import cors from "cors";
import path from "path";

import AppError from "./utils/AppError.js";
import errorHandler from "./middlewares/error.middleware.js";

// Khởi tạo ứng dụng Express
const app = express();

// Cấu hình middleware CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Cấu hình middleware parse dữ liệu JSON và urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ các tệp tĩnh (uploads)
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

// Endpoint kiểm tra sức khỏe hệ thống (Health Check)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

// Import và gắn các routes hiện có vào ứng dụng
import routes from "./Routes/index.js";
import loginRoutes from "./Routes/Auth/Login.js";
import OrderRoutes from "./Routes/Payment/OrderRoutes.js";
import RegisterRoutes from "./Routes/Auth/Register.js";
import userRoutes from "./Routes/User/UsersRoutes.js";
import AdminRoutes from "./Routes/Admin/AdminRoutes.js";
import cartRoutes from "./routes/cart.routes.js";

app.use("/app", routes);
app.use("/api", RegisterRoutes);
app.use("/api", loginRoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", AdminRoutes);

// Gắn route Giỏ hàng tại tiền tố chuẩn hóa /api/v1/cart
app.use("/api/v1/cart", cartRoutes);

// Xử lý route không tồn tại (404 Not Found)
app.use((req, res, next) => {
  next(
    new AppError(`Không tìm thấy đường dẫn ${req.originalUrl} trên máy chủ`, 404)
  );
});

// Middleware bắt lỗi toàn cục (bắt buộc đặt ở cuối cùng)
app.use(errorHandler);

export default app;
