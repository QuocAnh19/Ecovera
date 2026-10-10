import db from "../Config/dataBase.js";
import AppError from "../utils/AppError.js";

/**
 * Tạo đơn hàng với Transaction an toàn (kiểm tra tồn kho, trừ kho, lưu đơn, xóa giỏ hàng)
 */
export const createOrder = async (userId, orderData) => {
  const { items, shippingAddress, paymentMethod = "COD" } = orderData;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError("Danh sách sản phẩm không hợp lệ", 400);
  }

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    let calculatedTotal = 0;
    const verifiedItems = [];

    // 1. Kiểm tra tồn kho và lấy giá chuẩn từ DB
    for (const item of items) {
      const productId = item.productId || item.id;
      if (!productId) {
        throw new AppError("Thiếu thông tin mã sản phẩm", 400);
      }

      // Hỗ trợ kiểm tra linh hoạt cả 2 cấu trúc bảng products / Products
      let products;
      try {
        const [rows] = await connection.query(
          "SELECT * FROM products WHERE (id = ? OR product_id = ?) FOR UPDATE",
          [productId, productId]
        );
        products = rows;
      } catch (err) {
        const [rows] = await connection.query(
          "SELECT * FROM Products WHERE (product_id = ? OR id = ?) FOR UPDATE",
          [productId, productId]
        );
        products = rows;
      }

      if (!products || products.length === 0) {
        throw new AppError(
          `Sản phẩm với ID ${productId} không tồn tại`,
          404
        );
      }

      const product = products[0];
      const stock =
        product.stock !== undefined
          ? product.stock
          : product.quantity !== undefined
          ? product.quantity
          : 0;
      const price =
        product.price !== undefined
          ? product.price
          : product.sale_price ?? product.original_price ?? 0;
      const verifiedId = product.id ?? product.product_id ?? productId;

      if (stock < item.quantity) {
        throw new AppError(
          `Sản phẩm "${product.name}" không đủ số lượng tồn kho (còn ${stock})`,
          400
        );
      }

      calculatedTotal += Number(price) * Number(item.quantity);
      verifiedItems.push({
        productId: verifiedId,
        price: Number(price),
        quantity: Number(item.quantity),
      });
    }

    // 2. Tạo đơn hàng (Order)
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, status, created_at) 
       VALUES (?, ?, ?, ?, 'pending', NOW())`,
      [userId, calculatedTotal, shippingAddress || "", paymentMethod]
    );

    const orderId = orderResult.insertId;

    // 3. Tạo chi tiết đơn hàng (Order Items) & Cập nhật trừ tồn kho (Stock)
    for (const item of verifiedItems) {
      await connection.query(
        "INSERT INTO order_items (order_id, product_id, price, quantity) VALUES (?, ?, ?, ?)",
        [orderId, item.productId, item.price, item.quantity]
      );

      try {
        await connection.query(
          "UPDATE products SET stock = stock - ? WHERE id = ?",
          [item.quantity, item.productId]
        );
      } catch (stockErr) {
        await connection.query(
          "UPDATE Products SET quantity = quantity - ? WHERE product_id = ?",
          [item.quantity, item.productId]
        );
      }
    }

    // 4. Xóa sạch giỏ hàng của người dùng trong DB (nếu có bảng cart_items)
    try {
      await connection.query("DELETE FROM cart_items WHERE user_id = ?", [
        userId,
      ]);
    } catch (cartErr) {
      // Bỏ qua nếu bảng cart_items chưa khởi tạo
    }

    // Hoàn tất giao dịch an toàn
    await connection.commit();

    return {
      orderId,
      totalAmount: calculatedTotal,
      status: "pending",
    };
  } catch (error) {
    // Hoàn nguyên toàn bộ thao tác nếu xảy ra lỗi
    await connection.rollback();
    throw error;
  } finally {
    // Luôn giải phóng kết nối về pool
    connection.release();
  }
};

/**
 * Lấy danh sách đơn hàng của người dùng
 */
export const getOrdersByUserId = async (userId) => {
  const [orders] = await db.query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
  return orders;
};

/**
 * Lấy chi tiết đơn hàng kèm danh sách sản phẩm
 */
export const getOrderById = async (orderId, userId) => {
  const [orders] = await db.query(
    "SELECT * FROM orders WHERE (id = ? OR order_id = ?) AND user_id = ?",
    [orderId, orderId, userId]
  );

  if (!orders || orders.length === 0) {
    throw new AppError("Không tìm thấy đơn hàng", 404);
  }

  let items = [];
  try {
    const [rows] = await db.query(
      `SELECT oi.*, p.name, p.image 
       FROM order_items oi 
       JOIN products p ON (oi.product_id = p.id OR oi.product_id = p.product_id) 
       WHERE oi.order_id = ?`,
      [orderId]
    );
    items = rows;
  } catch (itemErr) {
    const [rows] = await db.query(
      `SELECT oi.*, p.name, p.image 
       FROM order_items oi 
       JOIN Products p ON (oi.product_id = p.product_id OR oi.product_id = p.id) 
       WHERE oi.order_id = ?`,
      [orderId]
    );
    items = rows;
  }

  return { ...orders[0], items };
};

export default {
  createOrder,
  getOrdersByUserId,
  getOrderById,
};
