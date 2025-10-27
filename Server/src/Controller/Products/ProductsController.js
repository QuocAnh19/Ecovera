import ProductModel from "../../Models/Products/ProductsModel.js";

export const getProducts = (req, res) => {
  ProductModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const addProduct = (req, res) => {
  const { name, price, description } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !price)
    return res.status(400).json({ message: "Name and price are required" });

  const newProduct = { name, price, description, image };

  ProductModel.create(newProduct, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "✅ Product added successfully!" });
  });
};
