import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import db from "../../Config/dataBase.js";

const router = express.Router();

// Hàm tạo product_id ngẫu nhiên
const generateProductId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "PRD-";
  for (let i = 0; i < 8; i++)
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
};

// Cấu hình multer lưu ảnh theo category
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.body.category;
    const dir = `src/uploads/${category}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.replace(/\s+/g, "_"));
  },
});
const upload = multer({ storage });

// ================== API: Get Products + tags ==================
router.get("/", async (req, res) => {
  try {
    const sql = `
      SELECT 
        p.product_id,
        p.category_id,
        p.name,
        p.description,
        p.original_price,
        p.sale_price,
        p.discount_percent,
        p.image,
        p.quantity,
        t.name AS tag_name
      FROM Products p
      LEFT JOIN Product_Tags pt ON p.product_id = pt.product_id
      LEFT JOIN Tags t ON pt.tag_id = t.tag_id
      WHERE p.is_active = 1
      ORDER BY p.name
    `;

    const [rows] = await db.query(sql);

    const productsMap = new Map();
    rows.forEach((row) => {
      const { product_id, tag_name, ...rest } = row;
      if (!productsMap.has(product_id)) {
        productsMap.set(product_id, { ...rest, product_id, tags: [] });
      }
      if (tag_name) productsMap.get(product_id).tags.push(tag_name);
    });

    const products = Array.from(productsMap.values());

    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products with tags:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ================== API: Get Count by Category ==================
router.get("/category-count", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
      c.folder_name AS category, 
      COUNT(p.product_id) AS total
      FROM Categories c
      LEFT JOIN Products p 
      ON c.category_id = p.category_id AND p.is_active = 1
      GROUP BY c.category_id, c.folder_name
      ORDER BY c.category_id;
    `);

    const result = {};
    rows.forEach((row) => {
      result[row.category] = row.total;
    });

    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching category counts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== API: Add Product ==================
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, category, original_price, sale_price, quantity } = req.body;

    // Validate
    if (!name || !category || !original_price)
      return res.status(400).json({ message: "Thiếu dữ liệu!" });

    const qty = quantity ? parseInt(quantity) : 0;
    if (isNaN(qty) || qty < 0)
      return res.status(400).json({ message: "Quantity không hợp lệ!" });

    // Lấy category_id
    const [cat] = await db.query(
      "SELECT category_id, folder_name FROM Categories WHERE folder_name = ?",
      [category]
    );
    if (!cat.length)
      return res.status(400).json({ message: "Category không tồn tại!" });

    const { category_id, folder_name } = cat[0];
    const product_id = generateProductId();

    // Xử lý ảnh
    let imagePath = null;
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const fileName = `${product_id}${ext}`;
      const newPath = `src/uploads/${folder_name}/${fileName}`;
      fs.renameSync(req.file.path, newPath);
      imagePath = `${folder_name}/${fileName}`;
    }

    // Tính discount
    const original = parseFloat(original_price);
    const sale = sale_price ? parseFloat(sale_price) : null;
    const discount = sale
      ? Math.round(((original - sale) / original) * 100)
      : 0;

    // Thêm sản phẩm
    await db.query(
      `INSERT INTO Products (product_id, category_id, name, original_price, sale_price, discount_percent, image, quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product_id,
        category_id,
        name,
        original,
        sale || null,
        discount,
        imagePath,
        qty,
      ]
    );

    // Parse tags
    let tags = [];
    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
      } catch (err) {
        tags = [];
      }
    }

    // Lưu tags vào Product_Tags
    if (Array.isArray(tags) && tags.length > 0) {
      const values = tags.map((tag_id) => [product_id, tag_id]);
      await db.query("INSERT INTO Product_Tags (product_id, tag_id) VALUES ?", [
        values,
      ]);
    }

    res.json({
      message: "Thêm sản phẩm thành công!",
      product_id,
      imagePath,
      quantity: qty,
      tags,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// GET /api/categories
router.get("/categories", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT category_id, folder_name 
      FROM Categories
      ORDER BY category_id;
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /products/:productId
router.delete("/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    // Xóa Product_Tags liên quan
    await db.query("DELETE FROM Product_Tags WHERE product_id = ?", [
      productId,
    ]);

    // Ẩn sản phẩm (is_active = 0)
    const [result] = await db.query(
      "UPDATE Products SET is_active = 0 WHERE product_id = ?",
      [productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    res.json({
      message: "Sản phẩm đã bị ẩn và tag liên quan đã xóa",
      productId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

export default router;
