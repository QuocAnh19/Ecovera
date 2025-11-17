import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, "SECRET_KEY", (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    req.user = user; // user = { id, email } từ token
    next();
  });
};
