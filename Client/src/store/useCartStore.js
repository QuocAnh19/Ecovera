import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartApi } from "../services/cartApi.js";

// Hàm tính toán tổng số lượng và tổng tiền
const calculateTotals = (items = []) => {
  const totalQuantity = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );
  const totalPrice = items.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
  return { totalQuantity, totalPrice };
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      totalQuantity: 0,
      totalPrice: 0,
      isLoading: false,

      // Thêm sản phẩm vào giỏ hàng
      addToCart: async (product, quantity = 1, isAuthenticated = false) => {
        const currentItems = get().cartItems;
        const productId = product.id || product.product_id;
        const existingIndex = currentItems.findIndex(
          (item) => (item.id || item.product_id) === productId
        );

        let updatedItems = [];
        if (existingIndex > -1) {
          updatedItems = currentItems.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          updatedItems = [
            ...currentItems,
            { ...product, id: productId, quantity },
          ];
        }

        const totals = calculateTotals(updatedItems);
        set({ cartItems: updatedItems, ...totals });

        if (isAuthenticated) {
          try {
            await cartApi.addItem(productId, quantity);
          } catch (error) {
            console.error("Lỗi đồng bộ giỏ hàng server:", error);
          }
        }
      },

      // Cập nhật số lượng sản phẩm
      updateQuantity: async (productId, quantity, isAuthenticated = false) => {
        if (quantity <= 0) {
          return get().removeFromCart(productId, isAuthenticated);
        }

        const updatedItems = get().cartItems.map((item) =>
          (item.id || item.product_id) === productId
            ? { ...item, quantity }
            : item
        );

        const totals = calculateTotals(updatedItems);
        set({ cartItems: updatedItems, ...totals });

        if (isAuthenticated) {
          try {
            await cartApi.addItem(productId, quantity);
          } catch (error) {
            console.error("Lỗi cập nhật số lượng server:", error);
          }
        }
      },

      // Xóa sản phẩm khỏi giỏ hàng
      removeFromCart: async (productId, isAuthenticated = false) => {
        const updatedItems = get().cartItems.filter(
          (item) => (item.id || item.product_id) !== productId
        );
        const totals = calculateTotals(updatedItems);
        set({ cartItems: updatedItems, ...totals });

        if (isAuthenticated) {
          try {
            await cartApi.removeItem(productId);
          } catch (error) {
            console.error("Lỗi xóa sản phẩm server:", error);
          }
        }
      },

      // Gộp giỏ hàng Local vào Server khi đăng nhập
      syncCartOnLogin: async () => {
        set({ isLoading: true });
        try {
          const localItems = get().cartItems;
          const res = await cartApi.mergeCart(localItems);
          const serverItems = res.data?.items || res.items || [];
          const totals = calculateTotals(serverItems);
          set({ cartItems: serverItems, ...totals });
        } catch (error) {
          console.error("Lỗi khi gộp giỏ hàng:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Xóa sạch giỏ hàng
      clearCart: async (isAuthenticated = false) => {
        set({ cartItems: [], totalQuantity: 0, totalPrice: 0 });
        if (isAuthenticated) {
          try {
            await cartApi.clearCart();
          } catch (error) {
            console.error("Lỗi làm trống giỏ hàng server:", error);
          }
        }
      },
    }),
    {
      name: "ecovera_cart_storage", // Key lưu tại localStorage
      partialize: (state) => ({ cartItems: state.cartItems }), // Chỉ cache mảng items
      onRehydrateStorage: () => (state) => {
        // Tự động tính lại totals khi khôi phục từ localStorage
        if (state && state.cartItems) {
          const totals = calculateTotals(state.cartItems);
          state.totalQuantity = totals.totalQuantity;
          state.totalPrice = totals.totalPrice;
        }
      },
    }
  )
);

export default useCartStore;
