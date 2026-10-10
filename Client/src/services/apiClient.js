import axios from "axios";
import { getAccessToken, clearTokens } from "../utils/token.js";

const getBaseUrl = () => {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  return "http://localhost:5000/api/v1";
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Tự động đính kèm Token
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

// Response Interceptor: Xử lý dữ liệu và bắt lỗi tập trung
apiClient.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp data từ ApiResponse chuẩn ở Server
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || "Có lỗi kết nối đến máy chủ";

    if (status === 401) {
      // Token hết hạn hoặc không hợp lệ
      clearTokens();
      // Chuyển hướng về trang đăng nhập nếu không đang ở trang đăng nhập
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
