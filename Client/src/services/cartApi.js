import apiClient from "./apiClient.js";

export const cartApi = {
  // Lấy thông tin giỏ hàng từ server
  getCart: () => apiClient.get("/cart"),
  fetchCart: () => apiClient.get("/cart"),

  // Thêm sản phẩm vào giỏ
  addToCart: (productIdOrPayload, quantity = 1) => {
    if (typeof productIdOrPayload === "object" && productIdOrPayload !== null) {
      return apiClient.post("/cart/items", productIdOrPayload);
    }
    return apiClient.post("/cart/items", {
      productId: productIdOrPayload,
      quantity,
    });
  },
  addItem: (productIdOrPayload, quantity = 1) => {
    if (typeof productIdOrPayload === "object" && productIdOrPayload !== null) {
      return apiClient.post("/cart/items", productIdOrPayload);
    }
    return apiClient.post("/cart/items", {
      productId: productIdOrPayload,
      quantity,
    });
  },

  // Cập nhật số lượng của mục trong giỏ
  updateQuantity: (cartItemId, quantity) =>
    apiClient.put(`/cart/items/${cartItemId}`, { quantity }),

  // Xóa sản phẩm khỏi giỏ
  removeItem: (cartItemId) => apiClient.delete(`/cart/items/${cartItemId}`),

  // Gộp giỏ hàng LocalStorage lên Server khi đăng nhập
  mergeCart: (items) => apiClient.post("/cart/merge", { items }),

  // Làm trống toàn bộ giỏ hàng
  clearCart: () => apiClient.delete("/cart"),
};

export const {
  getCart,
  fetchCart,
  addToCart,
  addItem,
  updateQuantity,
  removeItem,
  mergeCart,
  clearCart,
} = cartApi;

export default cartApi;
