const ACCESS_TOKEN_KEY = "ecovera_access_token";
const REFRESH_TOKEN_KEY = "ecovera_refresh_token";

export const getAccessToken = () => {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token")
  );
};

export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("token", token);
  }
};

export const getRefreshToken = () => {
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    localStorage.getItem("refreshToken")
  );
};

export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
    localStorage.setItem("refreshToken", token);
  }
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

const tokenService = {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  clearTokens,
};

export default tokenService;
