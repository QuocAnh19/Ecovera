import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Vui lòng đăng nhập để tiếp tục", 401));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key_here"
    );
    req.user = decoded;
    if (!req.user.id && req.user.user_id) {
      req.user.id = req.user.user_id;
    }
    next();
  } catch (error) {
    return next(
      new AppError("Phiên đăng nhập không hợp lệ hoặc đã hết hạn", 401)
    );
  }
};

export default verifyToken;
export { verifyToken };
