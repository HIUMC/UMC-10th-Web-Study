import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

const clearAuthStorage = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
  localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
  localStorage.removeItem("nickname");
};

const isAuthExcludedUrl = (url?: string) => {
  return [
    "/v1/auth/signin",
    "/v1/auth/signup",
    "/v1/auth/refresh",
    "/v1/auth/google/login",
  ].includes(url ?? "");
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      clearAuthStorage();
      return Promise.reject(error);
    }

    if (isAuthExcludedUrl(originalRequest.url)) {
      clearAuthStorage();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = localStorage.getItem(
            LOCAL_STORAGE_KEY.refreshToken,
          );

          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const { data } = await axios.post(
            `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/refresh`,
            {
              refresh: refreshToken,
            },
          );

          const newAccessToken = data.data.accessToken;
          const newRefreshToken = data.data.refreshToken;

          localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, newAccessToken);
          localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, newRefreshToken);

          return newAccessToken;
        })().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      return axiosInstance.request(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      return Promise.reject(refreshError);
    }
  },
);
