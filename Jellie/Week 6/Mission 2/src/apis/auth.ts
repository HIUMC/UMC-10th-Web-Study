import axiosInstance from "./axios";

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
};

export type UpdateUserRequest = {
  name?: string;
  bio?: string;
  avatar?: string;
};

export const signIn = async (body: SignInRequest) => {
  const { data } = await axiosInstance.post("/auth/signin", body);
  return data;
};

export const signUp = async (body: SignUpRequest) => {
  const { data } = await axiosInstance.post("/auth/signup", body);
  return data;
};

export const signOut = async () => {
  const { data } = await axiosInstance.post("/auth/signout");
  return data;
};

export const getMyInfo = async () => {
  const { data } = await axiosInstance.get("/users/me");
  return data;
};

export const updateMyInfo = async (body: UpdateUserRequest) => {
  const { data } = await axiosInstance.patch("/users", body);
  return data;
};