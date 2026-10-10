import { useCartStore } from "../../store/useCartStore";

/**
 * @deprecated CartContext đã được loại bỏ và thay thế 100% bằng Zustand Store (useCartStore).
 * File này được giữ lại dưới dạng adapter tương thích ngược cho bất kỳ component nào chưa chuyển đổi import.
 */
export const useCart = () => useCartStore();

export const CartProvider = ({ children }) => children;

export default useCart;
