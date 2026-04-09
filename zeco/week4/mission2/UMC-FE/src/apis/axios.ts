import axios from 'axios';

const LOCAL_STORAGE_KEY = {
  ACCESS_TOKEN: 'accessToken',
} as const;

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
  }
  return config;
});

export { LOCAL_STORAGE_KEY };
export default axiosInstance;
