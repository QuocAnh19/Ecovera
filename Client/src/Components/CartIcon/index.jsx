import React from "react";

import style from "./CartIcon.module.scss";

import { IconCart } from "../../Assets";
import { useCart } from "../../ConText/CartContext";

export default function CartIcon({ handleGoToCart }) {
  const { cartItems } = useCart();

  const uniqueProductCount = cartItems.length;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className={style.cartIconWrapper} onClick={handleGoToCart}>
      <div className={style.iconBox}>
        <IconCart className={style.iconCart} />
        {uniqueProductCount > 0 && (
          <span className={style.badge}>{uniqueProductCount}</span>
        )}
      </div>

      <div className={style.cartInfo}>
        <div className={style.label}>Shopping cart:</div>
        <div className={style.total}>${totalPrice.toFixed(2)}</div>
      </div>
    </div>
  );
}
