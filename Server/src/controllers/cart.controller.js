import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import cartService from "../services/cart.service.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCartByUserId(req.user.id);
  return ApiResponse.success(res, cart, "Lấy giỏ hàng thành công");
});

export const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const updatedCart = await cartService.addItemToCart(
    req.user.id,
    productId,
    quantity
  );
  return ApiResponse.success(
    res,
    updatedCart,
    "Đã cập nhật sản phẩm vào giỏ hàng"
  );
});

export const removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const updatedCart = await cartService.removeItemFromCart(
    req.user.id,
    productId
  );
  return ApiResponse.success(res, updatedCart, "Đã xóa sản phẩm khỏi giỏ hàng");
});

export const mergeCart = asyncHandler(async (req, res) => {
  const { items } = req.body; // Mảng items từ LocalStorage gửi lên
  const mergedCart = await cartService.mergeLocalCart(req.user.id, items || []);
  return ApiResponse.success(res, mergedCart, "Đồng bộ giỏ hàng thành công");
});

export const emptyCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user.id);
  return ApiResponse.success(res, null, "Giỏ hàng đã được làm trống");
});

export default {
  getCart,
  addItem,
  removeItem,
  mergeCart,
  emptyCart,
};
