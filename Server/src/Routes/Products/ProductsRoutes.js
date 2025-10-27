import express from "express";
import dataBase from "../../Config/dataBase.js";
const router = express.Router();

// Hàm parse an toàn
const safeParse = (str) => {
  if (!str) return [];
  try {
    // Nếu str là object (vì MySQL JSON), convert sang string trước
    const jsonStr = typeof str === "string" ? str : JSON.stringify(str);
    return JSON.parse(jsonStr);
  } catch {
    // Nếu không phải JSON hợp lệ, tách theo dấu phẩy
    const plainStr = typeof str === "string" ? str : String(str);
    return plainStr ? plainStr.split(",").map((s) => s.trim()) : [];
  }
};

// Lấy tất cả sản phẩm
router.get("/", (req, res) => {
  const query = "SELECT * FROM Products";
  dataBase.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const products = results.map((item) => ({
      ...item,
      tags: item.tags ? safeParse(item.tags) : [],
    }));

    res.json(products);
  });
});

export default router;
