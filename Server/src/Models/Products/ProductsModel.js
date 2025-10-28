import dataBase from "../../Config/dataBase.js";

const ProductsModel = {
  // Lấy toàn bộ sản phẩm
  async getAll() {
    const [rows] = await dataBase.query("SELECT * FROM Products");
    return rows;
  },

  // Lấy sản phẩm theo ID
  async getById(id) {
    const [rows] = await dataBase.query("SELECT * FROM Products WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },
};

export default  ProductsModel;
