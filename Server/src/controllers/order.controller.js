import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import orderService from "../services/order.service.js";

export const checkout = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body);
  return ApiResponse.created(res, order, "Đặt hàng thành công");
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getOrdersByUserId(req.user.id);
  return ApiResponse.success(res, orders, "Lấy danh sách đơn hàng thành công");
});

export const getOrderDetail = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user.id);
  return ApiResponse.success(res, order, "Lấy chi tiết đơn hàng thành công");
});

export default {
  checkout,
  getMyOrders,
  getOrderDetail,
};
