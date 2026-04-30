import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/v1",
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

  if (accessToken) {
    config.headers.Authorization = "Bearer " + accessToken;
  }

  return config;
});

export default axiosInstance;