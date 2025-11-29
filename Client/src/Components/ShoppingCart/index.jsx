import React from "react";
import { useNavigate } from "react-router-dom";

import style from "./ShoppingCart.module.scss";

import Button from "../Button";
import QualitySelector from "../QualitySelector";
import { useCart } from "../../ConText/CartContext";
import { IconClose } from "../../Assets/Icon";

export default function ShoppingCart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // Tính subtotal và tổng
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.salePrice ? item.salePrice : item.originalPrice;
    return sum + price * item.quantity;
  }, 0);

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

          {cartItems.map((item) => {
            const price = item.salePrice ? item.salePrice : item.originalPrice;

            return (
              <div key={item.id} className={style.cartRow}>
                <div className={style.product}>
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                  />
                  <span>{item.name}</span>
                </div>

                <div className={style.price}>${price}</div>

                <div className={style.quantity}>
                  <QualitySelector
                    value={item.quantity}
                    onChange={(newQty) => updateQuantity(item.id, newQty)}
                  />
                </div>

                <div className={style.subtotal}>
                  ${(price * item.quantity).toFixed(2)}
                </div>

                <Button
                  size="circleCloseBorder"
                  closeBorder
                  className={style.removeBtn}
                  onClick={() => removeFromCart(item.id)}
                >
                  <IconClose />
                </Button>
              </div>
            );
          })}
        </div>

        <div className={style.cartFooter}>
          <div className={style.total}>
            <span>Total:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Button
            fill
            className={`${style.btnSubmit}`}
            // onClick={() => navigate("checkout")}
            href={"/checkout"}
            disabled={cartItems.length == 0 ? true : false}
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
