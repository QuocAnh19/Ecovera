import express from "express";
import bcrypt from "bcryptjs";
import dataBase from "../../Config/dataBase.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: "Missing fields" });

  try {
    const [rows] = await dataBase
      .promise()
      .query("SELECT * FROM Users WHERE email = ?", [email]);
    if (rows.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "Email not found" });

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });

    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      "SECRET_KEY",
      { expiresIn: "2h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
