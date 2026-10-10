import apiClient from "./apiClient.js";

export const orderApi = {
  createOrder: (orderData) => apiClient.post("/orders", orderData),
  getMyOrders: () => apiClient.get("/orders/my-orders"),
  getOrderDetail: (orderId) => apiClient.get(`/orders/${orderId}`),
};

export const { createOrder, getMyOrders, getOrderDetail } = orderApi;

export default orderApi;
