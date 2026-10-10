import axios from "axios";
import { getAccessToken, clearTokens } from "../utils/token.js";

/**
 * Khởi tạo axios instance với baseURL từ biến môi trường hoặc fallback về localhost
 */
const apiClient = axios.create({
  baseURL:
    (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) ||
    (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE_URL) ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor: Tự động lấy accessToken từ token.js và đính kèm vào header
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Trả về trực tiếp data và xử lý mã lỗi 401 Unauthorized
 */
apiClient.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp payload data từ máy chủ
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.mess ||
      error.message ||
      "Có lỗi kết nối đến máy chủ";

    // Bắt lỗi 401 Unauthorized: token hết hạn hoặc không hợp lệ
    if (status === 401) {
      clearTokens();

      // Điều hướng về trang đăng nhập nếu người dùng đang ở trang cần bảo vệ
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/signin") &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/signin";
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
