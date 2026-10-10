import React from "react";

import style from "./CartIcon.module.scss";
import { IconCart } from "../../Assets";
import { useCartStore } from "../../store/useCartStore";

export default function CartIcon({ handleGoToCart }) {
  const totalItems = useCartStore((state) => state.totalItems);
  const totalAmount = useCartStore((state) => state.totalAmount);

  return (
    <div className={style.cartIconWrapper} onClick={handleGoToCart}>
      <div className={style.iconBox}>
        <IconCart className={style.iconCart} />
        {totalItems > 0 && (
          <span className={style.badge}>{totalItems}</span>
        )}
      </div>

      <div className={style.cartInfo}>
        <div className={style.label}>Shopping cart:</div>
        <div className={style.total}>${Number(totalAmount).toFixed(2)}</div>
      </div>
    </div>
  );
}
