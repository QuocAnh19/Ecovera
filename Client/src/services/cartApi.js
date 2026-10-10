import apiClient from "./apiClient.js";

export const cartApi = {
  fetchCart: () => apiClient.get("/cart"),
  addItem: (productIdOrPayload, quantity = 1) => {
    if (typeof productIdOrPayload === "object" && productIdOrPayload !== null) {
      return apiClient.post("/cart/items", productIdOrPayload);
    }
    return apiClient.post("/cart/items", {
      productId: productIdOrPayload,
      quantity,
    });
  },
  removeItem: (productId) => apiClient.delete(`/cart/items/${productId}`),
  mergeCart: (items) => apiClient.post("/cart/merge", { items }),
  clearCart: () => apiClient.delete("/cart"),
};

export const { fetchCart, addItem, removeItem, mergeCart, clearCart } = cartApi;

export default cartApi;
