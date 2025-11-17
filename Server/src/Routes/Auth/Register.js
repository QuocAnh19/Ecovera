import express from "express";
import bcrypt from "bcryptjs";
import dataBase from "../../Config/dataBase.js";
import jwt from "jsonwebtoken";

const router = express.Router();

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
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    // kiểm tra email trùng
    const [rows] = await dataBase
      .promise()
      .query("SELECT * FROM Users WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // tạo user_id
    const user_id = generateUserId();

    // lưu vào database (chỉ email + password + user_id)
    await dataBase
      .promise()
      .query(
        "INSERT INTO Users (user_id, email, password, role) VALUES (?, ?, ?, ?)",
        [user_id, email, hashedPassword, "customer"]
      );

    // tạo JWT
    const token = jwt.sign({ id: user_id, email }, "SECRET_KEY", {
      expiresIn: "2h",
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: { id: user_id, email },
      token,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

export default router;
