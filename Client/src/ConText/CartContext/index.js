import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    if (!saved) return [];
    try {
      return JSON.parse(saved).map((item) => ({
        ...item,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Thêm product
  const addToCart = (products) => {
    const items = Array.isArray(products) ? products : [products];

    setCartItems((prev) => {
      const newCart = [...prev];

      items.forEach((product) => {
        // Lấy ID chuẩn từ backend
        const id = product.product_id || product.id;

        // Lấy giá ưu tiên sale_price, fallback original_price
        const price = Number(
          product.sale_price ??
            product.salePrice ??
            product.original_price ??
            product.originalPrice ??
            0
        );

        const quantity = Number(product.quantity) || 1;

        // Chuẩn hóa product trước khi push vào cart
        const normalized = {
          ...product,
          id,
          price,
          quantity,
        };

        // Kiểm tra nếu sản phẩm đã có trong giỏ hay chưa
        const index = newCart.findIndex((item) => item.id === id);
        if (index >= 0) {
          newCart[index].quantity += quantity;
        } else {
          newCart.push(normalized);
        }
      });

      return newCart;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQty) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
