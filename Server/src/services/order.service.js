import { v4 as uuidv4 } from "uuid";
import db from "../Config/dataBase.js";
import AppError from "../utils/AppError.js";

/**
 * Tạo đơn hàng mới với MySQL Transaction và Atomic Update chống Race Condition
 */
export const createOrder = async (userId, orderData = {}) => {
  const {
    items = [],
    shippingAddress = "",
    paymentMethod = "COD",
    customer,
  } = orderData;

  const orderItems = Array.isArray(items) && items.length > 0 ? items : [];

  if (orderItems.length === 0) {
    throw new AppError("Danh sách sản phẩm trong đơn hàng không được để trống", 400);
  }

  const resolvedAddress = shippingAddress || customer?.address || "";
  const resolvedPaymentMethod = (paymentMethod || "COD").toUpperCase();

  const connection = await db.getConnection();

  try {
    // 1. Khởi tạo Transaction
    await connection.beginTransaction();

    let calculatedTotal = 0;
    const verifiedItems = [];

    // 2. Duyệt qua từng sản phẩm: Lấy giá chuẩn và trừ tồn kho bằng Atomic UPDATE
    for (const item of orderItems) {
      const productId = item.productId || item.id || item.product_id;
      const qty = parseInt(item.quantity, 10);

      if (!productId || isNaN(qty) || qty <= 0) {
        throw new AppError("Thông tin sản phẩm hoặc số lượng không hợp lệ", 400);
      }

      // Lấy thông tin giá và tên sản phẩm từ cơ sở dữ liệu
      let product = null;
      try {
        const [rows] = await connection.query(
          "SELECT id, name, price, stock_quantity FROM products WHERE id = ?",
          [productId]
        );
        if (rows && rows.length > 0) {
          product = rows[0];
        }
      } catch (err) {
        // Fallback linh hoạt nếu cấu trúc bảng ban đầu là Products
        try {
          const [rows] = await connection.query(
            "SELECT product_id AS id, name, COALESCE(sale_price, original_price, 0) AS price, quantity AS stock_quantity FROM Products WHERE product_id = ? OR id = ?",
            [productId, productId]
          );
          if (rows && rows.length > 0) {
            product = rows[0];
          }
        } catch (fallbackErr) {
          // Bỏ qua lỗi query fallback
        }
      }

      if (!product) {
        throw new AppError(`Sản phẩm với ID ${productId} không tồn tại`, 404);
      }

      const itemPrice = Number(product.price) || Number(item.price) || 0;
      const productName = product.name || `Sản phẩm #${productId}`;

      // THỰC HIỆN ATOMIC UPDATE TRỪ TỒN KHO ĐỂ CHỐNG RACE CONDITION
      // Chỉ thành công khi stock_quantity >= qty tại chính thời điểm thực thi câu lệnh SQL
      let updateResult;
      try {
        const [res] = await connection.query(
          "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?",
          [qty, productId, qty]
        );
        updateResult = res;
      } catch (atomicErr) {
        // Fallback cho cột quantity / bảng Products cũ nếu chưa migration cột stock_quantity
        try {
          const [res] = await connection.query(
            "UPDATE products SET quantity = quantity - ? WHERE (id = ? OR product_id = ?) AND quantity >= ?",
            [qty, productId, productId, qty]
          );
          updateResult = res;
        } catch (resErr) {
          const [res] = await connection.query(
            "UPDATE Products SET quantity = quantity - ? WHERE (product_id = ? OR id = ?) AND quantity >= ?",
            [qty, productId, productId, qty]
          );
          updateResult = res;
        }
      }

      // Nếu affectedRows === 0 nghĩa là tồn kho không đủ (hoặc đã bị người khác mua mất)
      if (!updateResult || updateResult.affectedRows === 0) {
        throw new AppError(
          `Sản phẩm "${productName}" không đủ số lượng tồn kho hoặc đã hết hàng`,
          400
        );
      }

      calculatedTotal += itemPrice * qty;
      verifiedItems.push({
        productId,
        name: productName,
        price: itemPrice,
        quantity: qty,
      });
    }

    // 3. Thêm bản ghi vào bảng orders
    const orderUuid = uuidv4();
    let orderId;

    try {
      const [orderResult] = await connection.query(
        `INSERT INTO orders (user_id, order_uuid, total_amount, shipping_address, payment_method, status, created_at) 
         VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
        [
          userId,
          orderUuid,
          calculatedTotal,
          resolvedAddress,
          resolvedPaymentMethod,
        ]
      );
      orderId = orderResult.insertId;
    } catch (orderInsertErr) {
      // Hỗ trợ schema cũ sử dụng order_id làm khóa chính dạng chuỗi
      const customOrderId = `ORDER-${Date.now()}`;
      await connection.query(
        `INSERT INTO orders (order_id, user_id, order_uuid, total_amount, shipping_address, payment_method, status, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, 'Processing', NOW())`,
        [
          customOrderId,
          userId,
          orderUuid,
          calculatedTotal,
          resolvedAddress,
          resolvedPaymentMethod,
        ]
      );
      orderId = customOrderId;
    }

    // 4. Thêm hàng loạt vào bảng order_items (Batch Insert)
    const orderItemsRows = verifiedItems.map((item) => [
      orderId,
      item.productId,
      item.price,
      item.quantity,
    ]);

    if (orderItemsRows.length > 0) {
      try {
        await connection.query(
          "INSERT INTO order_items (order_id, product_id, price, quantity) VALUES ?",
          [orderItemsRows]
        );
      } catch (batchErr) {
        // Fallback chèn từng dòng cho cấu trúc bảng có trường khóa chính riêng biệt
        for (const item of verifiedItems) {
          const detailId = `DETAIL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          try {
            await connection.query(
              "INSERT INTO order_items (order_id, product_id, price, quantity) VALUES (?, ?, ?, ?)",
              [orderId, item.productId, item.price, item.quantity]
            );
          } catch (singleErr) {
            await connection.query(
              "INSERT INTO order_items (order_detail_id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)",
              [detailId, orderId, item.productId, item.quantity, item.price]
            );
          }
        }
      }
    }

    // 5. Nếu đơn hàng tạo từ giỏ hàng, xóa các mục tương ứng trong cart_items
    if (userId) {
      try {
        await connection.query("DELETE FROM cart_items WHERE user_id = ?", [
          userId,
        ]);
      } catch (cartErr) {
        // Bỏ qua nếu bảng cart_items chưa khởi tạo
      }
    }

    // 6. Hoàn tất và ghi nhận Transaction
    await connection.commit();

    return {
      orderId,
      order_id: orderId,
      order_uuid: orderUuid,
      userId,
      totalAmount: calculatedTotal,
      shippingAddress: resolvedAddress,
      paymentMethod: resolvedPaymentMethod,
      status: "pending",
      items: verifiedItems,
    };
  } catch (error) {
    // Hoàn nguyên Transaction nếu xảy ra bất kỳ lỗi nào
    await connection.rollback();
    throw error;
  } finally {
    // Luôn luôn giải phóng kết nối về Pool để tránh rò rỉ Connection Pool
    connection.release();
  }
};

/**
 * Lấy danh sách đơn hàng của người dùng
 */
export const getOrdersByUserId = async (userId) => {
  if (!userId) {
    throw new AppError("UserId không hợp lệ", 400);
  }

  const [orders] = await db.query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
  return orders;
};

/**
 * Lấy chi tiết đơn hàng theo id / order_id / uuid
 */
export const getOrderById = async (orderIdentifier, userId = null) => {
  if (!orderIdentifier) {
    throw new AppError("Thiếu mã đơn hàng", 400);
  }

  let orders = [];
  if (userId) {
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE (id = ? OR order_id = ? OR order_uuid = ?) AND user_id = ?",
      [orderIdentifier, orderIdentifier, orderIdentifier, userId]
    );
    orders = rows;
  } else {
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE id = ? OR order_id = ? OR order_uuid = ?",
      [orderIdentifier, orderIdentifier, orderIdentifier]
    );
    orders = rows;
  }

  if (!orders || orders.length === 0) {
    throw new AppError("Không tìm thấy đơn hàng", 404);
  }

  const order = orders[0];
  const orderKey = order.order_id || order.id;

  let items = [];
  try {
    const [rows] = await db.query(
      `SELECT oi.*, p.name AS product_name, p.image AS product_image
       FROM order_items oi
       JOIN products p ON (oi.product_id = p.id OR oi.product_id = p.product_id)
       WHERE oi.order_id = ?`,
      [orderKey]
    );
    items = rows;
  } catch (err) {
    try {
      const [rows] = await db.query(
        `SELECT oi.*, p.name AS product_name, p.image AS product_image
         FROM order_items oi
         JOIN Products p ON (oi.product_id = p.product_id OR oi.product_id = p.id)
         WHERE oi.order_id = ?`,
        [orderKey]
      );
      items = rows;
    } catch (e2) {
      items = [];
    }
  }

  return { ...order, items };
};

/**
 * Cập nhật trạng thái thanh toán ảo
 */
export const payOrder = async (uuid) => {
  if (!uuid) {
    throw new AppError("Thiếu mã thanh toán đơn hàng", 400);
  }

  const [result] = await db.query(
    "UPDATE orders SET status = 'Processing' WHERE (order_uuid = ? OR id = ? OR order_id = ?)",
    [uuid, uuid, uuid]
  );

  if (result.affectedRows === 0) {
    throw new AppError("Đơn hàng không tồn tại hoặc đã được thanh toán", 404);
  }

  return {
    success: true,
    message: "Thanh toán thành công!",
  };
};

export default {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  payOrder,
};
