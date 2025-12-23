import React, { useState } from "react";
import style from "./AddProduct.module.scss";

// import Button from "../../Components/Button";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    original_price: "",
    sale_price: "",
    quantity: "",
    tags: [],
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("category", form.category);
    data.append("original_price", form.original_price);
    data.append("sale_price", form.sale_price);
    data.append("quantity", form.quantity);
    data.append("tags", JSON.stringify(form.tags));
    data.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/app/products/add", {
        method: "POST",
        body: data,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        console.log("Error response:", result);
        throw new Error("Lỗi khi thêm sản phẩm");
      }

      alert("Product added successfully.!");
      setForm({
        name: "",
        category: "",
        original_price: "",
        sale_price: "",
        quantity: "",
        tags: [], // reset array
      });
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("Error when adding product. Please try again.");
    }
  };

  return (
    <div className={style.addProduct}>
      <h5>Add New Product</h5>
      <form onSubmit={handleSubmit}>
        <label>Product name:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Category:</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">-- Choose category --</option>
          <option value="Fruits">Fresh Fruit</option>
          <option value="Vegetables">Fresh Vegetables</option>
          <option value="MeatFish">Meat & Fish</option>
        </select>

        <label>Original Price:</label>
        <input
          type="number"
          step="0.01"
          name="original_price"
          value={form.original_price}
          onChange={handleChange}
          required
        />

        <label>Sale Price (if any):</label>
        <input
          type="number"
          step="0.01"
          name="sale_price"
          value={form.sale_price}
          onChange={handleChange}
        />

        <label>Product tags: (if any)</label>
        <select
          name="tags"
          multiple
          size={4}
          value={form.tags}
          onChange={(e) => {
            const selected = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setForm({ ...form, tags: selected });
          }}
        >
          <option value="TAG001">Sale</option>
          <option value="TAG002">New</option>
          <option value="TAG003">Out Of Stock</option>
          <option value="TAG004">Best Sale</option>
        </select>

        <label>Quality:</label>
        <input
          type="number"
          min="0"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />

        <label>Product image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        {/* <Button fill> </Button> */}
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
