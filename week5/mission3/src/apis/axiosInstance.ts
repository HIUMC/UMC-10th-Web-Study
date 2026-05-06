import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', 
  timeout: 5000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const accessToken = JSON.parse(token);
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 시 갱신
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const refreshTokenParsed = JSON.parse(refreshToken);

        // 리프레시 토큰으로 새 accessToken 발급
        const response = await axios.post(
          'http://localhost:8000/v1/auth/refresh',
          { refreshToken: refreshTokenParsed },
          { withCredentials: true }
        );

        const newAccessToken = response.data.data.accessToken;
        localStorage.setItem('accessToken', JSON.stringify(newAccessToken));

        // 새 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 - 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;