import AppRoutes from "./Routes";

import "./App.scss";
import { CartProvider } from "./ConText/CartContext";

export default function App() {
  return (
    <CartProvider>
      <div className="app">
        <AppRoutes />
      </div>
    </CartProvider>
  );
}
