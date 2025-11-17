import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import dataBase from "../../Config/dataBase.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cấu hình nơi lưu ảnh upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "..", "..", "uploads", "Dashboard"); // Server/uploads/Dashboard
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// API cập nhật thông tin người dùng
router.post("/updateProfile", upload.single("image"), async (req, res) => {
  try {
    const { user_id, name, address, email, phone } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!user_id || !name) {
      return res
        .status(400)
        .json({ success: false, message: "Missing user_id or name" });
    }

    let sql = "UPDATE Users SET name = ?, address = ?, email = ?, phone = ?";
    const params = [name, address, email, phone];

    if (image) {
      sql += ", image = ?";
      params.push(image);
    }

    sql += " WHERE user_id = ?";
    params.push(user_id);

    await dataBase.promise().query(sql, params);

    // Query lại user vừa update
    const [rows] = await dataBase
      .promise()
      .query(
        "SELECT *, CONCAT('/uploads/Dashboard/', image) AS image_url FROM Users WHERE user_id = ?",
        [user_id]
      );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const updatedUser = rows[0];

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

export default router;
