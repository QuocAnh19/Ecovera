import { createContext, useContext, useState } from "react";

// Tạo context
const CartContext = createContext();

// Custom hook để dễ dùng
export const useCart = () => useContext(CartContext);

// Provider bọc toàn bộ app
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 🛒 Hàm thêm sản phẩm
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        // Nếu sản phẩm đã có, tăng số lượng
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Nếu chưa có, thêm mới
      return [...prevItems, { ...product, quantity }];
    });
  };

  // 🗑️ Xóa sản phẩm (optional)
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // 🔄 Cập nhật số lượng sản phẩm
  const updateQuantity = (id, newQty) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
