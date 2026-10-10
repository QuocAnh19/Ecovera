import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import cartService from "../services/cart.service.js";

/**
 * Lấy danh sách sản phẩm trong giỏ hàng và tổng tiền
 */
export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user.user_id;
  const cart = await cartService.getCart(userId);
  return ApiResponse.success(res, cart, "Lấy giỏ hàng thành công");
});

/**
 * Thêm sản phẩm vào giỏ hàng (kiểm tra tồn kho)
 */
export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user.user_id;
  const { productId, quantity = 1 } = req.body;
  const targetProductId = productId || req.body.id;

  const updatedCart = await cartService.addToCart(
    userId,
    targetProductId,
    quantity
  );
  return ApiResponse.success(res, updatedCart, "Đã thêm sản phẩm vào giỏ hàng");
});

export const addItem = addToCart;

/**
 * Cập nhật số lượng của 1 mục trong giỏ hàng
 */
export const updateQuantity = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user.user_id;
  const cartItemId = req.params.cartItemId || req.params.productId || req.params.id;
  const { quantity } = req.body;

  const updatedCart = await cartService.updateItemQuantity(
    userId,
    cartItemId,
    quantity
  );
  return ApiResponse.success(
    res,
    updatedCart,
    "Cập nhật số lượng giỏ hàng thành công"
  );
});

export const updateItemQuantity = updateQuantity;

/**
 * Xóa một sản phẩm khỏi giỏ hàng
 */
export const removeItem = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user.user_id;
  const cartItemId = req.params.cartItemId || req.params.productId || req.params.id;

  const updatedCart = await cartService.removeItem(userId, cartItemId);
  return ApiResponse.success(res, updatedCart, "Đã xóa sản phẩm khỏi giỏ hàng");
});

/**
 * Xóa sạch toàn bộ giỏ hàng
 */
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user.user_id;
  const result = await cartService.clearCart(userId);
  return ApiResponse.success(res, result, "Giỏ hàng đã được làm trống");
});

export const emptyCart = clearCart;

/**
 * Gộp giỏ hàng LocalStorage khi user đăng nhập
 */
export const mergeCart = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user.user_id;
  const { items } = req.body;

  const mergedCart = await cartService.mergeLocalCart(userId, items || []);
  return ApiResponse.success(res, mergedCart, "Đồng bộ giỏ hàng thành công");
});

export default {
  getCart,
  addToCart,
  addItem,
  updateQuantity,
  updateItemQuantity,
  removeItem,
  clearCart,
  emptyCart,
  mergeCart,
};
