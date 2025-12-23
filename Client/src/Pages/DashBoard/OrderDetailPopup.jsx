import React from "react";
import style from "./OrderDetailPopup.module.scss";

export default function OrderDetailPopup({ open, onClose, items, order }) {
  if (!open || !order) return null;

  return (
    <div className={style.overlay}>
      <div className={style.popup}>
        <button className={style.closeBtn} onClick={onClose}>
          x
        </button>

        <h4>Order Details</h4>

        {/* ====== ORDER INFO ====== */}
        <div className={style.section}>
          <h6>Order Information</h6>
          <div className={style.infoBox}>
            <p>
              <strong>Order ID:</strong> {order.order_id}
            </p>
            <p>
              <strong>Creation date:</strong> {order.created_at}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Payment method:</strong> {order.payment_method}
            </p>
            <p>
              <strong>Total amount:</strong> $
              {order.total_amount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* ====== SHIPPING INFO ====== */}
        <div className={style.section}>
          <h6>Receiver Information</h6>

          <div className={style.infoBox}>
            <p>
              <strong>Receiver:</strong> {order.receiver_name}
            </p>
            <p>
              <strong>Phone number:</strong> {order.receiver_phone}
            </p>
            <p>
              <strong>Address:</strong> {order.shipping_address}
            </p>
          </div>
        </div>

        {/* ====== ITEMS LIST ====== */}
        <div className={style.section}>
          <h6>Products in order</h6>

          <div className={style.list}>
            {items.map((item) => (
              <div key={item.product_id} className={style.item}>
                <img
                  src={`http://localhost:5000/uploads/${item.product_image}`}
                  alt=""
                  className={style.img}
                />

                <div className={style.info}>
                  <p className={style.productName}>{item.product_name}</p>
                  <p>
                    Price: ${item.price.toLocaleString()} x {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
