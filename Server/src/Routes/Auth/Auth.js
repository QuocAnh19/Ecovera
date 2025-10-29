import express from "express";
import bcrypt from "bcryptjs";
import dataBase from "../../Config/dataBase.js";

const router = express.Router();

// POST /register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // kiểm tra thiếu thông tin
  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    // kiểm tra email trùng
    const [rows] = await dataBase
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // lưu vào dataBase
    await dataBase
      .query("INSERT INTO users (email, password) VALUES (?, ?)", [
        email,
        hashedPassword,
      ]);
    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
