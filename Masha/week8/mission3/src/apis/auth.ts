import axios from "axios";
import { authAxios } from "./axios";

const BASE_URL = "http://localhost:8000/v1";

export interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (data: LoginRequest) => {
  const res = await axios.post(`${BASE_URL}/auth/signin`, data);
  return res.data;
};

export const logout = async () => {
  const res = await authAxios.post("/auth/signout");
  return res.data;
};

export const withdraw = async () => {
  const res = await authAxios.delete("/users");
  return res.data;
};