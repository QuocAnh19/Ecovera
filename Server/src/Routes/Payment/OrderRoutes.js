import express from "express";
import { v4 as uuidv4 } from "uuid";
import dataBase from "../../Config/dataBase.js";
import { verifyToken } from "../Auth/VerifyToken.js";

const router = express.Router();

// 🧾 Tạo đơn hàng mới (user phải login)
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { cart, total, payment_method } = req.body;
    const userId = req.user.id; // ✅ user đang login
    const order_uuid = uuidv4();

    // Lưu đơn hàng
    const [result] = await dataBase.query(
      `INSERT INTO orders (user_id, order_uuid, total, payment_method, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [userId, order_uuid, total, payment_method]
    );

    const orderId = result.insertId;

    // Lưu từng sản phẩm vào order_items
    for (const item of cart) {
      await dataBase.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.id, item.quantity, item.price]
      );
    }

    res.json({ success: true, order_uuid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
});

// 💳 Thanh toán ảo
router.post("/pay/:uuid", verifyToken, async (req, res) => {
  const { uuid } = req.params;

  try {
    await dataBase.query(
      "UPDATE orders SET status='paid', paid_at=NOW() WHERE order_uuid=?",
      [uuid]
    );
    res.json({ success: true, message: "Thanh toán ảo thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
});

export default router;
