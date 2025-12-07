import express from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../../Config/dataBase.js";

const router = express.Router();

// 💡 HÀM TẠO ID CÓ TIỀN TỐ
const generateId = (prefix, count) => {
  const padded = String(count).padStart(5, "0");
  return `${prefix}-${padded}`;
};

// 🧾 Tạo đơn hàng mới (KHÔNG DÙNG TOKEN)
router.post("/create", async (req, res) => {
  console.log("🟦 Request Body:", req.body);

  const { cart, total, payment_method, customer } = req.body;

  const userId = req.body.user_id;

  const order_uuid = uuidv4();
  const shipping_address = customer?.address || "";

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1️⃣ Tạo ORDER_ID (loop tối đa 5 lần tránh trùng)
    let orderId;
    let attempts = 0;
    let isDuplicate = true;
    let countBase = 0;

    while (isDuplicate && attempts < 5) {
      attempts++;

      const [count] = await connection.query(
        "SELECT COUNT(*) AS count FROM orders"
      );

      countBase = count[0].count + attempts;
      orderId = generateId("ORDER", countBase);

      const [exist] = await connection.query(
        "SELECT order_id FROM orders WHERE order_id=?",
        [orderId]
      );

      if (exist.length === 0) isDuplicate = false;
    }

    if (isDuplicate) {
      await connection.rollback();
      return res.status(500).json({
        success: false,
        mess: "Không tạo được Order ID. Vui lòng thử lại!",
      });
    }

    // 2️⃣ Insert order
    await connection.query(
      `
      INSERT INTO orders 
        (order_id, user_id, order_uuid, total_amount, shipping_address, payment_method, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'Processing', NOW())
    `,
      [
        orderId,
        userId, // vẫn có thể null
        order_uuid,
        total,
        shipping_address,
        payment_method.toUpperCase(),
      ]
    );

    // 3️⃣ Insert order items
    const detailIdBase = countBase * 1000;
    let detailCount = 0;

    for (const item of cart) {
      detailCount++;

      const detailId = generateId("DETAIL", detailIdBase + detailCount);

      const productId = item.id || item.product_id;
      // Ưu tiên lấy price từ FE
      let price = item.price;

      // Nếu FE không có price, fallback sang salePrice/originalPrice
      if (!price) {
        price = item.sale_price ?? item.original_price ?? 0;
      }

      if (!price || price <= 0) {
        console.warn("⚠️ PRICE WARNING:", item);
      }

      await connection.query(
        `
        INSERT INTO order_items 
          (order_detail_id, order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?, ?)
      `,
        [detailId, orderId, productId, item.quantity, price]
      );
    }

    await connection.commit();

    return res.json({
      success: true,
      order_uuid,
      order_id: orderId,
    });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("❌ DB Error:", err);

    res.status(500).json({
      success: false,
      mess: "Lỗi tạo đơn hàng! Vui lòng kiểm tra dữ liệu.",
    });
  } finally {
    if (connection) connection.release();
  }
});

// 💳 Thanh toán ảo
router.post("/pay/:uuid", async (req, res) => {
  const { uuid } = req.params;

  try {
    const [result] = await db.query(
      "UPDATE orders SET status='Processing' WHERE order_uuid=? AND status='Processing'",
      [uuid]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        mess: "Không tìm thấy đơn hàng hoặc đã thanh toán rồi.",
      });
    }

    res.json({
      success: true,
      mess: "Thanh toán ảo thành công!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      mess: "Payment failed",
    });
  }
});

// ------------------ ORDER VIEW ROUTES ------------------ //

// GET /orders/user/:user_id
router.get("/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const [rows] = await db.query(
      "SELECT order_id, order_uuid, total_amount, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );

    res.json({ success: true, orders: rows });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// GET /orders/detail/:order_id
router.get("/detail/:uuid", async (req, res) => {
  try {
    const { uuid } = req.params;

    // ---- Lấy ORDER bằng UUID (đúng logic mua hàng của bạn) ----
    const [orderRows] = await db.query(
      "SELECT * FROM orders WHERE order_uuid = ?",
      [uuid]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orderRows[0];

    // ---- Lấy ITEMS theo order_id ----
    const [items] = await db.query(
      `SELECT 
        oi.product_id,
        oi.quantity,
        oi.price,
        p.name AS product_name,
        p.image AS product_image
       FROM order_items oi
       JOIN Products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [order.order_id]
    );

    return res.json({
      success: true,
      order,
      items,
    });
  } catch (err) {
    console.error("Order detail error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

export default router;
