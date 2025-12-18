import express from "express";
const router = express.Router();
import db from "../../config/dataBase.js";

// 1. Lấy tất cả đơn hàng
router.get("/orders/all", async (req, res) => {
  try {
    const sql = `
      SELECT o.*, 
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'product_id', oi.product_id, 
          'product_name', p.name, 
          'product_image', p.image, 
          'price', oi.price, 
          'quantity', oi.quantity
        )
      ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      GROUP BY o.order_id
      ORDER BY o.created_at DESC`;

    // Với Promise client, dùng cú pháp destructuring [rows]
    const [rows] = await db.query(sql);

    // Xử lý dữ liệu JSON (nếu driver không tự parse)
    const formattedData = rows.map((row) => ({
      ...row,
      items: typeof row.items === "string" ? JSON.parse(row.items) : row.items,
    }));

    res.json(formattedData);
  } catch (err) {
    console.error("Lỗi SQL:", err);
    res.status(500).json({ error: "Lỗi hệ thống khi lấy đơn hàng" });
  }
});

// 2. Cập nhật trạng thái
router.put("/orders/update-status/:id", async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const sql = "UPDATE orders SET status = ? WHERE order_id = ?";
    await db.query(sql, [status, id]);

    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    console.error("Lỗi Update:", err);
    res.status(500).json({ error: "Không thể cập nhật trạng thái" });
  }
});

// --- API LẤY TOÀN BỘ NGƯỜI DÙNG ---
router.get("/users/all", async (req, res) => {
  try {
    const sql = "SELECT user_id, name, email, phone, address, role, created_at, image FROM users ORDER BY created_at DESC";
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
  }
});

// --- 3. API CẬP NHẬT QUYỀN (ROLE) ---
router.put("/users/update-role/:id", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const sql = "UPDATE users SET role = ? WHERE user_id = ?";
    await db.query(sql, [role, id]);
    res.json({ message: "Cập nhật quyền thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi cập nhật quyền" });
  }
});

export default router;
