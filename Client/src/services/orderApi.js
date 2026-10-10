import apiClient from "./apiClient.js";

/**
 * Service API quản lý các thao tác đơn hàng (Order)
 */
export const orderApi = {
  /**
   * Tạo đơn hàng mới
   * @param {Object} orderData Dữ liệu đơn hàng gồm { shippingAddress, paymentMethod, items, customer }
   * @returns {Promise<any>}
   */
  createOrder: (orderData) => apiClient.post("/orders", orderData),

  /**
   * Lấy danh sách các đơn hàng của người dùng hiện tại (cần xác thực)
   * @returns {Promise<any>}
   */
  getMyOrders: () => apiClient.get("/orders/my-orders"),

  /**
   * Lấy chi tiết đơn hàng theo orderId hoặc uuid
   * @param {string|number} orderId Mã đơn hàng
   * @returns {Promise<any>}
   */
  getOrderDetail: (orderId) => apiClient.get(`/orders/${orderId}`),

  /**
   * Thanh toán đơn hàng ảo qua UUID
   * @param {string} orderUuid UUID của đơn hàng
   * @returns {Promise<any>}
   */
  payOrder: (orderUuid) => apiClient.post(`/orders/pay/${orderUuid}`),
};

export const { createOrder, getMyOrders, getOrderDetail, payOrder } = orderApi;

export default orderApi;
