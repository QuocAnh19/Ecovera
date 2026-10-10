import React from "react";
import { useNavigate } from "react-router-dom";

import style from "./ShoppingCart.module.scss";

import Button from "../Button";
import QualitySelector from "../QualitySelector";
import { useCartStore } from "../../store/useCartStore";
import { IconClose } from "../../Assets/Icon";

export default function ShoppingCart() {
  const { cartItems, removeItem, updateQuantity, totalAmount } = useCartStore();
  const navigate = useNavigate();

  return (
    <div className={style.shoppingCartContainer}>
      <div className={style.content}>
        <h5>My Shopping Cart</h5>

        <div className={style.cartTable}>
          <div className={style.cartHeader}>
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
          </div>

          {cartItems.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#666" }}>
              Giỏ hàng của bạn đang trống.
            </div>
          ) : (
            cartItems.map((item) => {
              const price = Number(
                item.price ?? item.sale_price ?? item.original_price ?? 0
              );
              const itemId = item.cartItemId || item.id || item.productId;
              const imageSrc = item.image
                ? item.image.startsWith("http")
                  ? item.image
                  : `http://localhost:5000/uploads/${item.image}`
                : "/placeholder.png";

              return (
                <div key={itemId} className={style.cartRow}>
                  <div className={style.product}>
                    <img src={imageSrc} alt={item.name} />
                    <span>{item.name}</span>
                  </div>

                  <div className={style.price}>${price.toFixed(2)}</div>

                  <div className={style.quantity}>
                    <QualitySelector
                      value={item.quantity}
                      onChange={(newQty) => updateQuantity(itemId, newQty)}
                    />
                  </div>

                  <div className={style.subtotal}>
                    ${(price * item.quantity).toFixed(2)}
                  </div>

                  <Button
                    size="circleCloseBorder"
                    closeBorder
                    className={style.removeBtn}
                    onClick={() => removeItem(itemId)}
                  >
                    <IconClose />
                  </Button>
                </div>
              );
            })
          )}
        </div>

        <div className={style.cartFooter}>
          <div className={style.total}>
            <span>Total:</span>
            <span>${Number(totalAmount).toFixed(2)}</span>
          </div>
          <Button
            fill
            className={`${style.btnSubmit}`}
            href={"/shoppingCart/checkout"}
            disabled={cartItems.length === 0}
          >
            Proceed to checkout
          </Button>
        </div>
      </div>
      <div className={style.btnReturn}>
        <Button ghost className={style.btn} onClick={() => navigate(-1)}>
          Return
        </Button>
      </div>
    </div>
  );
}
