import React from "react";
import style from "./OrderDetailPopup.module.scss";

export default function OrderDetailPopup({ open, onClose, items, order }) {
  if (!open || !order) return null;

  const renderStatus = (status) => {
    switch (status) {
      case "processing":
        return <span className={style.statusProc}>Processing</span>;
      case "shipping":
        return <span className={style.statusShip}>Shipping</span>;
      default:
        return status;
    }
  };

  return (
    <div className={style.overlay} onClick={onClose}>
      <div className={style.popup} onClick={(e) => e.stopPropagation()}>
        <button className={style.closeBtn} onClick={onClose}>
          &times;
        </button>

        <h4>Order Details #{order.order_id}</h4>

        <div className={style.grid}>
          <div className={style.infoSection}>
            <div className={style.card}>
              <h6>Customers & Receiving</h6>
              <p>
                <strong>User ID:</strong> {order.user_id}
              </p>
              <p>
                <strong>Receiver:</strong> {order.receiver_name}
              </p>
              <p>
                <strong>Phone:</strong> {order.receiver_phone}
              </p>
              <p>
                <strong>Address:</strong> {order.shipping_address}
              </p>
            </div>

            <div className={style.card}>
              <h6>Payment</h6>
              <p>
                <strong>Method:</strong> {order.payment_method}
              </p>
              <p>
                <strong>Status:</strong> {renderStatus(order.status)}
              </p>
              <p className={style.total}>
                <strong>Total:</strong> ${order.total_amount?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className={style.itemsSection}>
            <h5>Ordered product</h5>
            <div className={style.itemList}>
              {items && items.length > 0 ? (
                items.map((item, index) => (
                  <div key={index} className={style.productItem}>
                    <img
                      src={`http://localhost:5000/uploads/${item.product_image}`}
                      alt={item.product_name}
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/50")
                      }
                    />
                    <div className={style.productInfo}>
                      <p className={style.name}>{item.product_name}</p>
                      <p className={style.price}>
                        ${item.price?.toLocaleString()} x {item.quantity}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No product data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
