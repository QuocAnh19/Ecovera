import db from "../Config/dataBase.js";
import AppError from "../utils/AppError.js";

// Bộ nhớ đệm fallback dự phòng trong trường hợp offline DB
const memoryCartStore = new Map();

// Đảm bảo bảng carts và cart_items tồn tại trong cơ sở dữ liệu
let isTableInitialized = false;
const ensureCartTables = async () => {
  if (isTableInitialized) return true;
  try {
    // 1. Bảng carts
    await db.query(`
      CREATE TABLE IF NOT EXISTS carts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Bảng cart_items
    await db.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cart_id INT NULL,
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

/**
 * Tìm hoặc tạo giỏ hàng cho user
 */
const getOrCreateCartId = async (userId) => {
  try {
    const [existing] = await db.query(
      "SELECT id FROM carts WHERE user_id = ?",
      [userId]
    );
    if (existing && existing.length > 0) {
      return existing[0].id;
    }
    const [result] = await db.query(
      "INSERT INTO carts (user_id) VALUES (?)",
      [userId]
    );
    return result.insertId;
  } catch (err) {
    return null;
  }
};

/**
 * Lấy thông tin sản phẩm và số lượng tồn kho từ database
 */
const getProductWithStock = async (productId) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, price, stock_quantity, image FROM products WHERE id = ?",
      [productId]
    );
    if (rows && rows.length > 0) {
      return {
        id: rows[0].id,
        name: rows[0].name,
        price: Number(rows[0].price) || 0,
        stock: Number(rows[0].stock_quantity) || 0,
        image: rows[0].image || "",
      };
    }
  } catch (err) {
    try {
      const [rows] = await db.query(
        "SELECT product_id AS id, name, COALESCE(sale_price, original_price, 0) AS price, quantity AS stock_quantity, image FROM Products WHERE product_id = ? OR id = ?",
        [productId, productId]
      );
      if (rows && rows.length > 0) {
        return {
          id: rows[0].id,
          name: rows[0].name,
          price: Number(rows[0].price) || 0,
          stock: Number(rows[0].stock_quantity) || 0,
          image: rows[0].image || "",
        };
      }
    } catch (fallbackErr) {}
  }
  return null;
};

/**
 * Tính toán tổng số lượng và tổng tiền giỏ hàng
 */
const calculateCartTotals = (items = []) => {
  const formattedItems = items.map((item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    return {
      id: item.id || item.cartItemId,
      cartItemId: item.id || item.cartItemId,
      productId: item.productId || item.product_id,
      name: item.name || "Sản phẩm",
      price,
      image: item.image || "",
      stock: Number(item.stock ?? item.stock_quantity ?? 999),
      quantity: qty,
      subtotal: price * qty,
    };
  });

  const totalQuantity = formattedItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = formattedItems.reduce((sum, i) => sum + i.subtotal, 0);

  return {
    items: formattedItems,
    totalQuantity,
    totalPrice,
  };
};

/**
 * 1. Lấy thông tin giỏ hàng theo userId
 */
export const getCart = async (userId) => {
  if (!userId) {
    throw new AppError("UserId không hợp lệ", 400);
  }

  const hasDb = await ensureCartTables();
  if (hasDb) {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          ci.id AS cartItemId,
          ci.id,
          ci.product_id AS productId,
          ci.quantity,
          COALESCE(p.name, 'Sản phẩm') AS name,
          COALESCE(p.price, p.sale_price, p.original_price, 0) AS price,
          COALESCE(p.stock_quantity, p.quantity, 0) AS stock,
          COALESCE(p.image, '') AS image
        FROM cart_items ci
        LEFT JOIN products p ON (ci.product_id = p.id OR ci.product_id = p.product_id)
        WHERE ci.user_id = ?
        ORDER BY ci.updated_at DESC
      `,
        [userId]
      );

      return calculateCartTotals(rows);
    } catch (dbErr) {
      console.warn("Lỗi truy vấn giỏ hàng MySQL, chuyển sang bộ nhớ tạm:", dbErr.message);
    }
  }

  const localItems = memoryCartStore.get(userId) || [];
  return calculateCartTotals(localItems);
};

export const getCartByUserId = getCart;

/**
 * 2. Thêm sản phẩm vào giỏ hàng (tìm/tạo cart, kiểm tra tồn kho)
 */
export const addToCart = async (userId, productId, quantity = 1) => {
  if (!userId) {
    throw new AppError("UserId không hợp lệ", 400);
  }
  if (!productId) {
    throw new AppError("Thiếu productId", 400);
  }

  const addQty = parseInt(quantity, 10);
  if (isNaN(addQty) || addQty <= 0) {
    throw new AppError("Số lượng thêm vào giỏ phải lớn hơn 0", 400);
  }

  const hasDb = await ensureCartTables();
  if (hasDb) {
    // Kiểm tra thông tin sản phẩm và tồn kho
    const product = await getProductWithStock(productId);
    if (!product) {
      throw new AppError(`Sản phẩm với ID ${productId} không tồn tại`, 404);
    }

    const cartId = await getOrCreateCartId(userId);

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const [existingItems] = await db.query(
      "SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    const currentQty = existingItems.length > 0 ? Number(existingItems[0].quantity) : 0;
    const newTotalQty = currentQty + addQty;

    // Kiểm tra không vượt quá tồn kho
    if (newTotalQty > product.stock) {
      throw new AppError(
        `Số lượng yêu cầu (${newTotalQty}) vượt quá tồn kho hiện có (${product.stock}) của sản phẩm "${product.name}"`,
        400
      );
    }

    if (existingItems.length > 0) {
      await db.query(
        "UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?",
        [newTotalQty, existingItems[0].id]
      );
    } else {
      await db.query(
        `INSERT INTO cart_items (cart_id, user_id, product_id, quantity) 
         VALUES (?, ?, ?, ?)`,
        [cartId, userId, productId, addQty]
      );
    }

    return await getCart(userId);
  }

  // Fallback bộ nhớ tạm
  const currentItems = memoryCartStore.get(userId) || [];
  const idx = currentItems.findIndex(
    (i) => i.productId === productId || i.id === productId
  );

  if (idx > -1) {
    currentItems[idx].quantity += addQty;
  } else {
    currentItems.push({
      id: Date.now(),
      cartItemId: Date.now(),
      productId,
      name: `Sản phẩm #${productId}`,
      price: 0,
      image: "",
      stock: 999,
      quantity: addQty,
    });
  }

  memoryCartStore.set(userId, currentItems);
  return calculateCartTotals(currentItems);
};

export const addItemToCart = addToCart;

/**
 * 3. Cập nhật số lượng của một mục trong giỏ (nếu quantity <= 0 thì xóa)
 */
export const updateItemQuantity = async (userId, cartItemId, quantity) => {
  if (!userId) {
    throw new AppError("UserId không hợp lệ", 400);
  }
  if (!cartItemId) {
    throw new AppError("Thiếu mã mục giỏ hàng (cartItemId)", 400);
  }

  const targetQty = parseInt(quantity, 10);

  // Nếu số lượng <= 0 thì xóa sản phẩm khỏi giỏ
  if (isNaN(targetQty) || targetQty <= 0) {
    return await removeItem(userId, cartItemId);
  }

  const hasDb = await ensureCartTables();
  if (hasDb) {
    // Tìm mục giỏ hàng theo id hoặc product_id
    const [items] = await db.query(
      "SELECT id, product_id, quantity FROM cart_items WHERE user_id = ? AND (id = ? OR product_id = ?)",
      [userId, cartItemId, cartItemId]
    );

    if (!items || items.length === 0) {
      throw new AppError("Không tìm thấy mục trong giỏ hàng", 404);
    }

    const item = items[0];
    const product = await getProductWithStock(item.product_id);

    if (product && targetQty > product.stock) {
      throw new AppError(
        `Số lượng cập nhật (${targetQty}) vượt quá tồn kho hiện có (${product.stock}) của sản phẩm "${product.name}"`,
        400
      );
    }

    await db.query(
      "UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?",
      [targetQty, item.id]
    );

    return await getCart(userId);
  }

  // Fallback bộ nhớ tạm
  const currentItems = memoryCartStore.get(userId) || [];
  const idx = currentItems.findIndex(
    (i) => String(i.id) === String(cartItemId) || String(i.productId) === String(cartItemId)
  );

  if (idx > -1) {
    currentItems[idx].quantity = targetQty;
    memoryCartStore.set(userId, currentItems);
  }

  return calculateCartTotals(currentItems);
};

/**
 * 4. Xóa một sản phẩm khỏi giỏ hàng
 */
export const removeItem = async (userId, cartItemId) => {
  if (!userId) {
    throw new AppError("UserId không hợp lệ", 400);
  }
  if (!cartItemId) {
    throw new AppError("Thiếu cartItemId", 400);
  }

  const hasDb = await ensureCartTables();
  if (hasDb) {
    await db.query(
      "DELETE FROM cart_items WHERE user_id = ? AND (id = ? OR product_id = ?)",
      [userId, cartItemId, cartItemId]
    );
    return await getCart(userId);
  }

  const currentItems = memoryCartStore.get(userId) || [];
  const filtered = currentItems.filter(
    (i) => String(i.id) !== String(cartItemId) && String(i.productId) !== String(cartItemId)
  );
  memoryCartStore.set(userId, filtered);
  return calculateCartTotals(filtered);
};

export const removeItemFromCart = removeItem;

/**
 * 5. Xóa sạch toàn bộ item trong giỏ hàng của user
 */
export const clearCart = async (userId) => {
  if (!userId) {
    throw new AppError("UserId không hợp lệ", 400);
  }

  const hasDb = await ensureCartTables();
  if (hasDb) {
    await db.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);
  }

  memoryCartStore.delete(userId);
  return { items: [], totalQuantity: 0, totalPrice: 0 };
};

/**
 * 6. Gộp giỏ hàng LocalStorage khi user đăng nhập
 */
export const mergeLocalCart = async (userId, localItems = []) => {
  if (!userId) {
    throw new AppError("UserId không hợp lệ", 400);
  }

  if (Array.isArray(localItems) && localItems.length > 0) {
    for (const item of localItems) {
      const pid = item.productId || item.id;
      const qty = parseInt(item.quantity, 10) || 1;
      if (pid) {
        try {
          await addToCart(userId, pid, qty);
        } catch (err) {
          // Nếu vượt quá tồn kho thì bỏ qua hoặc thêm tối đa
          console.warn(`Bỏ qua mục ${pid} khi merge: ${err.message}`);
        }
      }
    }
  }

  return await getCart(userId);
};

export default {
  getCart,
  getCartByUserId,
  addToCart,
  addItemToCart,
  updateItemQuantity,
  removeItem,
  removeItemFromCart,
  clearCart,
  mergeLocalCart,
};
