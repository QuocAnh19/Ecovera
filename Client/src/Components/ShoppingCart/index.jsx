import React from "react";

import style from "./ShoppingCart.module.scss";

import Button from "../Button";
import QualitySelector from "../QualitySelector";
import { useCart } from "../../ConText/CartContext";

export default function ShoppingCart() {


  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // Tính subtotal và tổng
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className={style.shoppingCartContainer}>
      <h5>My Shopping Cart</h5>

      <div className={style.cartTable}>
        <div className={style.cartHeader}>
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Subtotal</span>
        </div>

        {cartItems.map((item) => (
          <div key={item.id} className={style.cartRow}>
            <div className={style.product}>
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.title}
              />
              <span>{item.title}</span>
            </div>

            <div className={style.price}>${item.price}</div>

            <div className={style.quantity}>
              <QualitySelector
                value={item.quantity}
                onChange={(newQty) => updateQuantity(item.id, newQty)}
              />
            </div>

            <div className={style.subtotal}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            <button
              className={style.removeBtn}
              onClick={() => removeFromCart(item.id)}
            >
              X
            </button>
          </div>
        ))}
      </div>

      <div className={style.cartFooter}>
        <div className={style.total}>
          <span>Total:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <Button fill className={style.btnSubmit} href={"/checkout"}>Proceed to checkout</Button>
      </div>
    </div>
  );
}
