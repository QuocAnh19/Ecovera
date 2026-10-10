import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import orderService from "../services/order.service.js";

/**
 * Xử lý đặt hàng (Checkout)
 * Payload nhận: { shippingAddress, paymentMethod, items }
 * userId lấy từ middleware xác thực req.user.id
 */
export const checkout = asyncHandler(async (req, res) => {
  const {
    shippingAddress,
    paymentMethod,
    items,
    cart,
    customer,
    payment_method,
  } = req.body;

  // Lấy userId từ verifyToken middleware hoặc fallback từ req.body
  const userId = req.user?.id || req.user?.user_id || req.body.user_id;

  // Hỗ trợ linh hoạt cả định dạng payload mới lẫn các payload cũ của frontend
  const orderItems = items || cart || [];
  const address = shippingAddress || customer?.address || "";
  const method = paymentMethod || payment_method || "COD";

  const order = await orderService.createOrder(userId, {
    items: orderItems,
    shippingAddress: address,
    paymentMethod: method,
    customer,
  });

  return ApiResponse.created(res, order, "Đặt hàng thành công");
});

/**
 * Lấy danh sách đơn hàng của người dùng hiện tại
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?.user_id;
  const orders = await orderService.getOrdersByUserId(userId);
  return ApiResponse.success(res, orders, "Lấy danh sách đơn hàng thành công");
});

/**
 * Lấy chi tiết đơn hàng theo id / uuid
 */
export const getOrderDetail = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?.user_id;
  const orderIdentifier = req.params.id || req.params.uuid;
  const order = await orderService.getOrderById(orderIdentifier, userId);
  return ApiResponse.success(res, order, "Lấy chi tiết đơn hàng thành công");
});

/**
 * Lấy đơn hàng theo user_id truyền qua params (dành cho Dashboard / Admin)
 */
export const getOrdersByUserIdParam = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const orders = await orderService.getOrdersByUserId(user_id);
  return ApiResponse.success(res, orders, "Lấy danh sách đơn hàng thành công");
});

/**
 * Thanh toán đơn hàng ảo
 */
export const payOrder = asyncHandler(async (req, res) => {
  const { uuid } = req.params;
  const result = await orderService.payOrder(uuid);
  return ApiResponse.success(res, result, "Thanh toán thành công");
});

export default {
  checkout,
  getMyOrders,
  getOrderDetail,
  getOrdersByUserIdParam,
  payOrder,
};
