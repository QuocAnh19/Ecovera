// src/Pages/Admin/OrdersList.jsx

import React, { useEffect, useState } from 'react';

export default function OrdersList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // 💡 Fetch Orders
    useEffect(() => {
        fetch('http://localhost:5000/api/admin/orders') // Thay bằng API endpoint thực tế
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch orders failed:", err);
                setLoading(false);
            });
    }, []);

    // 💡 Xử lý cập nhật Status
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (res.ok) {
                // Cập nhật trạng thái trong state ngay lập tức
                setOrders(prev => prev.map(order => 
                    order.order_id === orderId ? { ...order, status: newStatus } : order
                ));
                alert(`Cập nhật trạng thái đơn hàng ${orderId} thành ${newStatus} thành công!`);
            } else {
                const errorData = await res.json();
                alert(`Lỗi cập nhật: ${errorData.message}`);
            }
        } catch (err) {
            console.error("Update status failed:", err);
            alert("Lỗi server khi cập nhật trạng thái!");
        }
    };

    if (loading) return <div>Đang tải danh sách đơn hàng...</div>;

    return (
        <div className="ordersList">
            <h3>Quản lý Đơn hàng</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID Order</th>
                        <th>ID User</th>
                        <th>Tổng tiền</th>
                        <th>Status</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.order_id}>
                            <td>{order.order_id}</td>
                            <td>{order.user_id || 'Khách (Guest)'}</td>
                            <td>${order.total_amount.toFixed(2)}</td>
                            <td>
                                <span className={`status-${order.status.toLowerCase()}`}>{order.status}</span>
                            </td>
                            <td>
                                {order.status === 'Processing' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(order.order_id, 'Shipping')}
                                    >
                                        Chuyển sang Shipping
                                    </button>
                                )}
                                {/* Thêm các trạng thái khác nếu cần (ví dụ: Delivered, Cancelled) */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}