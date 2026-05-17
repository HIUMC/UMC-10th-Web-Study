import axios from "axios";

export const authAxios = axios.create({
  baseURL: "http://localhost:8000/v1",
});

authAxios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});