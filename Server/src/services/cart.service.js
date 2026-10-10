import db from "../Config/dataBase.js";
import AppError from "../utils/AppError.js";

// Bộ nhớ đệm fallback trong trường hợp chưa kết nối MySQL
const memoryCartStore = new Map();

// Đảm bảo bảng cart_items tồn tại trong cơ sở dữ liệu
let isTableInitialized = false;
const ensureCartTable = async () => {
  if (isTableInitialized) return true;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        product_id VARCHAR(100) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_product (user_id, product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    isTableInitialized = true;
    return true;
  } catch (error) {
    return false;
  }
};

// Hàm tính toán tổng số lượng và tổng tiền
const calculateTotals = (items = []) => {
  const totalQuantity = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );
  const totalPrice = items.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
  return { items, totalQuantity, totalPrice };
};

/**
 * Lấy giỏ hàng theo userId
 */
export const getCartByUserId = async (userId) => {
  if (!userId) {
    throw new AppError("UserId không hợp lệ", 400);
  }

  const hasDb = await ensureCartTable();
  if (hasDb) {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          ci.id,
          ci.product_id AS productId,
          ci.product_id AS id,
          ci.quantity,
          COALESCE(p.name, 'Sản phẩm') AS name,
          COALESCE(p.sale_price, p.original_price, 0) AS price,
          COALESCE(p.image, '') AS image
        FROM cart_items ci
        LEFT JOIN Products p ON ci.product_id = p.product_id
        WHERE ci.user_id = ?
        ORDER BY ci.updated_at DESC
      `,
        [userId]
      );

      return calculateTotals(rows);
    } catch (dbErr) {
      console.warn("Lỗi truy vấn giỏ hàng từ MySQL, chuyển sang bộ nhớ tạm:", dbErr.message);
    }
  }

  const items = memoryCartStore.get(userId) || [];
  return calculateTotals(items);
};

/**
 * Thêm hoặc cập nhật số lượng sản phẩm trong giỏ hàng
 */
export const addItemToCart = async (userId, productId, quantity = 1) => {
  if (!userId) {
    throw new AppError("UserId không hợp lệ", 400);
  }
  if (!productId) {
    throw new AppError("Thiếu productId", 400);
  }

  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const hasDb = await ensureCartTable();

  if (hasDb) {
    try {
      await db.query(
        `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
      `,
        [userId, productId, qty]
      );
      return await getCartByUserId(userId);
    } catch (dbErr) {
      console.warn("Lỗi thêm giỏ hàng MySQL, chuyển sang bộ nhớ tạm:", dbErr.message);
    }
  }

  const currentItems = memoryCartStore.get(userId) || [];
  const existingIndex = currentItems.findIndex(
    (item) => item.productId === productId || item.id === productId
  );

  if (existingIndex > -1) {
    currentItems[existingIndex].quantity += qty;
  } else {
    currentItems.push({
      id: productId,
      productId,
      quantity: qty,
      name: `Sản phẩm ${productId}`,
      price: 0,
      image: "",
    });
  }

  memoryCartStore.set(userId, currentItems);
  return calculateTotals(currentItems);
};

/**
 * Xóa một sản phẩm khỏi giỏ hàng
 */
export const removeItemFromCart = async (userId, productId) => {
  if (!userId) {
    throw new AppError("UserId không hợp lệ", 400);
  }
  if (!productId) {
    throw new AppError("Thiếu productId", 400);
  }

  const hasDb = await ensureCartTable();
  if (hasDb) {
    try {
      await db.query(
        "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
        [userId, productId]
      );
      return await getCartByUserId(userId);
    } catch (dbErr) {
      console.warn("Lỗi xóa sản phẩm MySQL, chuyển sang bộ nhớ tạm:", dbErr.message);
    }
  }

  const currentItems = memoryCartStore.get(userId) || [];
  const filtered = currentItems.filter(
    (item) => item.productId !== productId && item.id !== productId
  );
  memoryCartStore.set(userId, filtered);
  return calculateTotals(filtered);
};

/**
 * Gộp giỏ hàng từ LocalStorage vào cơ sở dữ liệu khi đăng nhập
 */
export const mergeLocalCart = async (userId, localItems = []) => {
  if (!userId) {
    throw new AppError("UserId không hợp lệ", 400);
  }

  if (Array.isArray(localItems) && localItems.length > 0) {
    for (const item of localItems) {
      const pid = item.productId || item.id;
      const qty = item.quantity || 1;
      if (pid) {
        await addItemToCart(userId, pid, qty);
      }
    }
  }

  return await getCartByUserId(userId);
};

/**
 * Làm trống toàn bộ giỏ hàng của user
 */
export const clearCart = async (userId) => {
  if (!userId) {
    throw new AppError("UserId không hợp lệ", 400);
  }

  const hasDb = await ensureCartTable();
  if (hasDb) {
    try {
      await db.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);
    } catch (dbErr) {
      console.warn("Lỗi làm trống giỏ hàng MySQL:", dbErr.message);
    }
  }

  memoryCartStore.delete(userId);
  return { items: [], totalQuantity: 0, totalPrice: 0 };
};

export default {
  getCartByUserId,
  addItemToCart,
  removeItemFromCart,
  mergeLocalCart,
  clearCart,
};
