import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const authApi = axios.create({
  baseURL: BASE_URL,
});

// 요청 보낼 때 accessToken 자동 추가
authApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// accessToken 만료 시 refreshToken으로 재발급
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.clear();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/v1/auth/refresh`, {
          refreshToken,
        });

        console.log("토큰 재발급 응답:", data);

        const newAccessToken = data.accessToken ?? data.data?.accessToken;
        const newRefreshToken = data.refreshToken ?? data.data?.refreshToken;

        if (!newAccessToken) {
          localStorage.clear();
          return Promise.reject(error);
        }

        localStorage.setItem("accessToken", newAccessToken);

        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return authApi(originalRequest);
      } catch (refreshError) {
        console.error("토큰 재발급 실패:", refreshError);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);