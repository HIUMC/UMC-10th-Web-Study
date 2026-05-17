import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL, // http://localhost:8000
});

// 요청 인터셉터: Access Token 자동 첨부
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 시 토큰 재발급
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // POST /v1/auth/refresh 호출
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/v1/auth/refresh`,
          { refresh: refreshToken } // body에 refreshToken 전달
        );

        const newAccessToken = response.data.data.accessToken;

        // 새 토큰 저장
        localStorage.setItem("accessToken", newAccessToken);

        // 실패했던 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
      console.error("refresh 실패:", refreshError);
      return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;