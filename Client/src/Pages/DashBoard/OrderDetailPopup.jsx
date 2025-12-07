import React from "react";
import style from "./OrderDetailPopup.module.scss";

export default function OrderDetailPopup({ open, onClose, items, order }) {
  if (!open || !order) return null;

  return (
    <div className={style.overlay}>
      <div className={style.popup}>
        {/* CLOSE BUTTON */}
        <button className={style.closeBtn} onClick={onClose}>
          ×
        </button>

        <h2 className={style.title}>Chi tiết đơn hàng</h2>

        {/* ====== ORDER INFO ====== */}
        <div className={style.section}>
          <h3>Thông tin đơn hàng</h3>

          <div className={style.infoBox}>
            <p>
              <strong>Mã đơn hàng:</strong> {order.order_id}
            </p>
            <p>
              <strong>Ngày tạo:</strong> {order.created_at}
            </p>
            <p>
              <strong>Trạng thái:</strong> {order.status}
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong> {order.payment_method}
            </p>
            <p>
              <strong>Tổng tiền:</strong> {order.total_amount.toLocaleString()}₫
            </p>
          </div>
        </div>

        {/* ====== SHIPPING INFO ====== */}
        <div className={style.section}>
          <h3>Thông tin người nhận</h3>

          <div className={style.infoBox}>
            <p>
              <strong>Người nhận:</strong> {order.receiver_name}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {order.receiver_phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {order.shipping_address}
            </p>
          </div>
        </div>

        {/* ====== ITEMS LIST ====== */}
        <div className={style.section}>
          <h3>Sản phẩm trong đơn</h3>

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
                  <p>Giá: {item.price.toLocaleString()}₫</p>
                  <p>Số lượng: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
