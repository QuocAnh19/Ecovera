import ProductsModel from "../../Models/Products/ProductsModel.js";

const ProductsController = {
  // Lấy danh sách sản phẩm
  async getAll(req, res) {
    try {
      const products = await ProductsModel.getAll();
      res.json(products);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products" });
    }
  },

  // Lấy sản phẩm theo ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductsModel.getById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("❌ Error fetching product:", error);
      res.status(500).json({ message: "Error fetching product" });
    }
  },
};

export default ProductsController;
