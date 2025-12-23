import React, { useState, useEffect } from "react";
import style from "./Orders.module.scss";
import OrderDetailPopup from "./OrderDetailPopup";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Lấy danh sách đơn hàng dùng fetch
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/orders/all"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // Cập nhật trạng thái dùng fetch
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/orders/update-status/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      // Cập nhật state local
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, status: newStatus } : o
        )
      );

      console.log(`Order ${orderId} updated to ${newStatus}`);
    } catch (err) {
      alert("Error updating status to database!");
      console.error(err);
    }
  };

  const openDetail = (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  return (
    <div className={style.container}>
      <h4>Order Management</h4>

      <div className={style.tableWrapper}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Create Date</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.order_id}>
                  <td className={style.orderId}>#{order.order_id}</td>
                  <td>
                    <span className={style.userId}>{order.user_id}</span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleString("vi-VN")}</td>
                  <td className={style.amount}>
                    ${Number(order.total_amount).toLocaleString()}
                  </td>
                  <td>
                    <span className={style.badge}>
                      {order.payment_method?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <select
                      className={`${style.statusSelect} ${style[order.status]}`}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.order_id, e.target.value)
                      }
                    >
                      <option value="processing">Processing</option>
                      <option value="shipping">Shipping</option>
                      {/* <option value="delivered">Delivered</option> */}
                      {/* <option value="cancelled">Cancelled</option> */}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => openDetail(order)}
                      className={style.viewBtn}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  There are no orders in the system yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetailPopup
          open={showPopup}
          onClose={() => setShowPopup(false)}
          order={selectedOrder}
          items={selectedOrder.items || []}
        />
      )}
    </div>
  );
}
