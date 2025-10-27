import dataBase from "../../Config/dataBase.js";

const ProductModel = {
  getAll: (callback) => {
    dataBase.query("SELECT * FROM products", callback);
  },

  create: (product, callback) => {
    const sql = "INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)";
    dataBase.query(sql, [product.name, product.price, product.description, product.image], callback);
  },
};

export default ProductModel;
