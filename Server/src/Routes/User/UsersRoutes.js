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
    const dir = path.join(__dirname, "..", "..", "uploads", "Dashboard");
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

// API lấy thông tin user theo ID
router.get("/getUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await dataBase.query(
      "SELECT *, CONCAT('/uploads/Dashboard/', image) AS image_url FROM Users WHERE user_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: rows[0],
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
});

// API cập nhật thông tin người dùng
router.post("/updateProfile", upload.single("image"), async (req, res) => {
  try {
    const { user_id } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing user_id" });
    }

    const updateFields = {};
    const allowedFields = ["name", "address", "email", "phone"];

    // Chỉ thêm các trường có giá trị vào updateFields
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    }

    if (image) {
      updateFields.image = image;
    }

    // Nếu không có trường nào để cập nhật (trừ user_id)
    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data to update" });
    }

    // Xây dựng SQL linh hoạt
    const fieldAssignments = Object.keys(updateFields).map(
      (field) => `${field} = ?`
    );
    const sql = `UPDATE Users SET ${fieldAssignments.join(
      ", "
    )} WHERE user_id = ?`;

    const params = [...Object.values(updateFields), user_id];

    // Thực thi lệnh cập nhật
    await dataBase.promise().query(sql, params);

    // ... (Phần Query lại user và trả về response - KHÔNG THAY ĐỔI)
    const [rows] = await dataBase
      .promise()
      .query(
        "SELECT *, CONCAT('/uploads/Dashboard/', image) AS image_url FROM Users WHERE user_id = ?",
        [user_id]
      );
    // ... (Phần trả về updatedUser)

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
    // Bắt lỗi 500 nếu có bất kỳ vấn đề nào khác (như DB NOT NULL,...)
    res.status(500).json({ success: false, message: "Update failed" });
  }
});



export default router;
