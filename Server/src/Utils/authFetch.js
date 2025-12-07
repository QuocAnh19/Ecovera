export async function authFetch(url, options = {}) {
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // =============================
  // 1) GỬI API BẰNG ACCESS TOKEN
  // =============================
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Nếu accessToken hết hạn → BE trả status 401 hoặc mess: "expired"
  if (res.status === 401) {
    // =============================
    // 2) GỌI API REFRESH TOKEN
    // =============================
    const refreshRes = await fetch("http://localhost:5000/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const refreshData = await refreshRes.json();

    // Refresh token cũng hết hạn → logout
    if (!refreshData.success) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      localStorage.clear();
      window.location.href = "/signin";
      return;
    }

    // =============================
    // 3) LƯU ACCESS TOKEN MỚI
    // =============================
    localStorage.setItem("accessToken", refreshData.accessToken);
    accessToken = refreshData.accessToken;

    // =============================
    // 4) GỌI LẠI API GỐC VỚI TOKEN MỚI
    // =============================
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return res;
}
