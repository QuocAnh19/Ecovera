import { useEffect } from "react";
import AppRoutes from "./Routes";

import "./App.scss";
import { useCartStore } from "./store/useCartStore";

export default function App() {
  useEffect(() => {
    // Tự động đồng bộ giỏ hàng khi khởi động ứng dụng
    useCartStore.getState().fetchCart();
  }, []);

  return (
    <div className="app">
      <AppRoutes />
    </div>
  );
}
