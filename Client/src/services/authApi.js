import apiClient from "./apiClient.js";

export const authApi = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  register: (userData) => apiClient.post("/auth/register", userData),
  getProfile: () => apiClient.get("/auth/me"),
  getMe: () => apiClient.get("/auth/me"),
  logout: () => apiClient.post("/auth/logout"),
};

export const { login, register, getProfile, getMe, logout } = authApi;

export default authApi;
