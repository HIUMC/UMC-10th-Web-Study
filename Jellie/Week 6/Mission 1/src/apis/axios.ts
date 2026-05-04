import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

const getToken = (key: string) => {
  const token = localStorage.getItem(key);

  if (!token) {
    return null;
  }

  try {
    return JSON.parse(token);
  } catch {
    return token;
  }
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL + "/v1",
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = getToken(LOCAL_STORAGE_KEY.accessToken);

  if (accessToken) {
    config.headers.Authorization = "Bearer " + accessToken;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === "/auth/refresh") {
        localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
        localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = getToken(LOCAL_STORAGE_KEY.refreshToken);

          try {
            const { data } = await axios.post(
              import.meta.env.VITE_SERVER_API_URL + "/v1/auth/refresh",
              {
                refresh: refreshToken,
              }
            );

            const newAccessToken = data.data.accessToken;
            const newRefreshToken = data.data.refreshToken;

            localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, newAccessToken);
            localStorage.setItem(
              LOCAL_STORAGE_KEY.refreshToken,
              newRefreshToken
            );

            return newAccessToken;
          } catch (refreshError) {
            localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
            localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
            window.location.href = "/login";
            return Promise.reject(refreshError);
          } finally {
            refreshPromise = null;
          }
        })();
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = "Bearer " + newAccessToken;

      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;