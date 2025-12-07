import express from "express";
import bcrypt from "bcryptjs";
import db from "../../Config/dataBase.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const SECRET = process.env.JWT_SECRET;

// Hàm tạo user_id dạng USR-XXXXXX
const generateUserId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "USR-";
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    // ⭐ SỬA: Đổi 'message' thành 'mess'
    return res.status(400).json({ success: false, mess: "Missing fields" });
  }

  try {
    // kiểm tra email trùng
    const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      // ⭐ SỬA: Đổi 'message' thành 'mess'
      return res
        .status(400)
        .json({ success: false, mess: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // tạo user_id (Lưu ý: Bạn nên kiểm tra trùng lặp user_id do hàm random)
    const user_id = generateUserId();

    // lưu vào db
    await db.query(
      "INSERT INTO Users (user_id, email, password, role) VALUES (?, ?, ?, ?)",
      [user_id, email, hashedPassword, "customer"]
    );

    // tạo JWT
    const token = jwt.sign({ id: user_id, email }, SECRET, {
      expiresIn: "2h",
    });

    res.status(201).json({
      success: true,
      // ⭐ SỬA: Đổi 'message' thành 'mess'
      mess: "Account created successfully",
      user: { id: user_id, email },
      token,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      // ⭐ SỬA: Đổi 'message' thành 'mess'
      .json({ success: false, mess: "Server error", error: err.message });
  }
});

export default router;
