import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartApi } from "../services/cartApi.js";
import { getAccessToken } from "../utils/token.js";

/**
 * Kiểm tra xem người dùng hiện tại đã đăng nhập hay chưa
 */
const checkIsAuthenticated = () => {
  return Boolean(
    getAccessToken() ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("ecovera_access_token") ||
      localStorage.getItem("user")
  );
};

/**
 * Tính toán tổng số lượng và tổng tiền của giỏ hàng
 */
const calculateTotals = (items = []) => {
  const totalItems = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  const totalAmount = items.reduce((sum, item) => {
    const price = Number(
      item.price ??
        item.sale_price ??
        item.salePrice ??
        item.original_price ??
        item.originalPrice ??
        0
    );
    const qty = Number(item.quantity) || 0;
    return sum + price * qty;
  }, 0);

  return {
    totalItems,
    totalAmount,
    totalQuantity: totalItems, // Bí danh tương thích
    totalPrice: totalAmount, // Bí danh tương thích
    cartCount: totalItems, // Bí danh tương thích CartContext
    cartTotal: totalAmount, // Bí danh tương thích CartContext
  };
};

/**
 * Chuẩn hóa cấu trúc của item giỏ hàng
 */
const normalizeCartItem = (product, quantity = 1) => {
  const id = product.id ?? product.product_id ?? product.productId;
  const price = Number(
    product.price ??
      product.sale_price ??
      product.salePrice ??
      product.original_price ??
      product.originalPrice ??
      0
  );
  const name = product.name || product.product_name || "Sản phẩm";
  const image = product.image || product.product_image || "";
  const stock = Number(product.stock ?? product.stock_quantity ?? 999);
  const qty = Math.max(1, Number(quantity) || 1);

  return {
    ...product,
    id,
    productId: id,
    cartItemId: product.cartItemId || id,
    name,
    price,
    image,
    stock,
    quantity: qty,
  };
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      // ----------------- State -----------------
      cartItems: [],
      totalItems: 0,
      totalAmount: 0,
      totalQuantity: 0,
      totalPrice: 0,
      isLoading: false,

      // ----------------- Actions -----------------

      /**
       * 1. Đồng bộ dữ liệu giỏ hàng từ Backend (nếu đã đăng nhập)
       */
      fetchCart: async () => {
        if (!checkIsAuthenticated()) {
          // Chưa đăng nhập: Giữ nguyên dữ liệu từ localStorage persist
          const currentItems = get().cartItems || [];
          set(calculateTotals(currentItems));
          return;
        }

        set({ isLoading: true });
        try {
          const res = await cartApi.getCart();
          const serverCart = res.data || res;
          const serverItems = Array.isArray(serverCart.items)
            ? serverCart.items.map((i) => normalizeCartItem(i, i.quantity))
            : [];

          set({
            cartItems: serverItems,
            ...calculateTotals(serverItems),
          });
        } catch (error) {
          console.warn("Không thể tải giỏ hàng từ server, sử dụng local cache:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * 2. Thêm sản phẩm vào giỏ hàng
       * Hỗ trợ cả 1 sản phẩm, mảng sản phẩm hoặc truyền quantity
       */
      addItem: async (productOrProducts, quantity = 1) => {
        const rawItems = Array.isArray(productOrProducts)
          ? productOrProducts
          : [productOrProducts];

        const currentItems = [...get().cartItems];

        for (const raw of rawItems) {
          const normalized = normalizeCartItem(
            raw,
            raw.quantity ? raw.quantity : quantity
          );
          const existingIdx = currentItems.findIndex(
            (item) =>
              item.id === normalized.id ||
              item.productId === normalized.productId ||
              item.cartItemId === normalized.cartItemId
          );

          if (existingIdx > -1) {
            currentItems[existingIdx].quantity += normalized.quantity;
          } else {
            currentItems.push(normalized);
          }
        }

        const totals = calculateTotals(currentItems);
        set({ cartItems: currentItems, ...totals });

        // Đồng bộ lên server nếu đã đăng nhập
        if (checkIsAuthenticated()) {
          try {
            for (const raw of rawItems) {
              const pid = raw.id ?? raw.product_id ?? raw.productId;
              const qty = raw.quantity ? raw.quantity : quantity;
              if (pid) {
                await cartApi.addToCart(pid, qty);
              }
            }
          } catch (error) {
            console.error("Lỗi đồng bộ thêm giỏ hàng lên server:", error);
          }
        }
      },

      // Bí danh tương thích Context cũ và các component
      addToCart: (product, qty) => get().addItem(product, qty),

      /**
       * 3. Cập nhật số lượng của mục trong giỏ
       * Nếu quantity <= 0 thì tự động xóa
       */
      updateQuantity: async (cartItemId, newQuantity) => {
        const qty = Number(newQuantity);
        if (qty <= 0) {
          return await get().removeItem(cartItemId);
        }

        const currentItems = get().cartItems.map((item) => {
          if (
            item.id === cartItemId ||
            item.productId === cartItemId ||
            item.cartItemId === cartItemId
          ) {
            return { ...item, quantity: qty };
          }
          return item;
        });

        const totals = calculateTotals(currentItems);
        set({ cartItems: currentItems, ...totals });

        // Đồng bộ lên server nếu đã đăng nhập
        if (checkIsAuthenticated()) {
          try {
            await cartApi.updateQuantity(cartItemId, qty);
          } catch (error) {
            console.error("Lỗi cập nhật số lượng trên server:", error);
          }
        }
      },

      /**
       * 4. Xóa một sản phẩm khỏi giỏ hàng
       */
      removeItem: async (cartItemId) => {
        const currentItems = get().cartItems.filter(
          (item) =>
            item.id !== cartItemId &&
            item.productId !== cartItemId &&
            item.cartItemId !== cartItemId
        );

        const totals = calculateTotals(currentItems);
        set({ cartItems: currentItems, ...totals });

        // Đồng bộ lên server nếu đã đăng nhập
        if (checkIsAuthenticated()) {
          try {
            await cartApi.removeItem(cartItemId);
          } catch (error) {
            console.error("Lỗi xóa sản phẩm trên server:", error);
          }
        }
      },

      // Bí danh tương thích
      removeFromCart: (cartItemId) => get().removeItem(cartItemId),

      /**
       * 5. Làm trống giỏ hàng (sau khi checkout thành công)
       */
      clearCart: async () => {
        set({
          cartItems: [],
          totalItems: 0,
          totalAmount: 0,
          totalQuantity: 0,
          totalPrice: 0,
          cartCount: 0,
          cartTotal: 0,
        });

        // Xóa sạch cả khóa localStorage cũ của CartContext để dọn rác
        localStorage.removeItem("cartItems");

        if (checkIsAuthenticated()) {
          try {
            await cartApi.clearCart();
          } catch (error) {
            console.error("Lỗi làm trống giỏ hàng server:", error);
          }
        }
      },

      /**
       * 6. Gộp giỏ hàng LocalStorage lên Server khi vừa đăng nhập
       */
      syncCartOnLogin: async () => {
        set({ isLoading: true });
        try {
          const localItems = get().cartItems;
          if (localItems.length > 0) {
            const res = await cartApi.mergeCart(localItems);
            const serverCart = res.data || res;
            if (serverCart && Array.isArray(serverCart.items)) {
              const merged = serverCart.items.map((i) =>
                normalizeCartItem(i, i.quantity)
              );
              set({
                cartItems: merged,
                ...calculateTotals(merged),
              });
            }
          } else {
            await get().fetchCart();
          }
        } catch (error) {
          console.error("Lỗi khi gộp giỏ hàng lúc đăng nhập:", error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "ecovera_cart_storage", // Khóa lưu trữ trong localStorage
      partialize: (state) => ({ cartItems: state.cartItems }), // Chỉ lưu danh sách item
      onRehydrateStorage: () => (state) => {
        // Tự động tính lại tổng số lượng và tổng tiền khi nạp từ localStorage
        if (state && Array.isArray(state.cartItems)) {
          const totals = calculateTotals(state.cartItems);
          state.totalItems = totals.totalItems;
          state.totalAmount = totals.totalAmount;
          state.totalQuantity = totals.totalQuantity;
          state.totalPrice = totals.totalPrice;
        }
      },
    }
  )
);

export default useCartStore;
