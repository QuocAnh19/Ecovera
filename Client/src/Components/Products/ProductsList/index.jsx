// src/Pages/Admin/ProductsList/ProductsList.jsx
import { useEffect, useState } from "react";
import style from "./ProductsList.module.scss";
import CategoryNavigation from "../../../Layouts/Navigation/Category";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Fruits");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [toast, setToast] = useState("");
  const [confirm, setConfirm] = useState({ visible: false, productId: null });

  // Map category_id từ DB sang ID sidebar
  const categoryMap = {
    "CAT-0001": "Fruits",
    "CAT-0002": "Vegetables",
    "CAT-0003": "Cooking",
    "CAT-0004": "Snacks",
    "CAT-0005": "Beverages",
    "CAT-0006": "Beauty&Health",
    "CAT-0007": "Bread&Bakery",
  };

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:5000/app/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.filter((p) => p.is_active !== 0))); // chỉ hiển thị sản phẩm active
  }, []);

  // Lọc theo category
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => categoryMap[p.category_id] === activeCategory)
      );
    }
  }, [products, activeCategory]);

  // Xử lý yêu cầu xóa (mở confirm popup)
  const requestDelete = (productId) => {
    setConfirm({ visible: true, productId });
  };

  // Xóa sản phẩm
  const handleDelete = async (productId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/app/products/${productId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.product_id !== productId));
        setToast("Đã xóa sản phẩm thành công");
        setTimeout(() => setToast(""), 3000);
      } else {
        setToast("Lỗi: " + data.message);
        setTimeout(() => setToast(""), 3000);
      }
    } catch (err) {
      console.error(err);
      setToast("Lỗi server!");
      setTimeout(() => setToast(""), 3000);
    }
  };

  return (
    <div className={style.wrapper}>
      {/* Sidebar category */}
      <div className={style.sidebar}>
        <CategoryNavigation
          active={activeCategory}
          onSelect={(id) => setActiveCategory(id)}
        />
      </div>

      {/* Product list */}
      <div className={style.productList}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div key={p.product_id} className={style.card}>
              <img
                src={`http://localhost:5000/uploads/${p.image}`}
                alt={p.name}
                className={style.img}
              />
              <p>{p.name}</p>
              <p>Giá: ${p.original_price}</p>
              {p.sale_price && <p>Sale: ${p.sale_price}</p>}
              {p.tags && p.tags.length > 0 && (
                <div className={style.tags}>
                  {p.tags.map((t, i) => (
                    <span key={i}>{t}</span>
                  ))}
                </div>
              )}
              <div className={style.actions}>
                {/* <button className={style.editBtn}>Chỉnh sửa</button> */}
                <button
                  className={style.deleteBtn}
                  onClick={() => requestDelete(p.product_id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào</p>
        )}
      </div>

      {/* Toast */}
      {toast && <div className={style.toast}>{toast}</div>}

      {/* Confirm popup */}
      {confirm.visible && (
        <div className={style.confirmOverlay}>
          <div className={style.confirmBox}>
            <p>Bạn có chắc muốn xóa sản phẩm này?</p>
            <div className={style.actions}>
              <button
                className={style.confirmBtn}
                onClick={() => {
                  handleDelete(confirm.productId);
                  setConfirm({ visible: false, productId: null });
                }}
              >
                Xác nhận
              </button>
              <button
                className={style.cancelBtn}
                onClick={() => setConfirm({ visible: false, productId: null })}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
