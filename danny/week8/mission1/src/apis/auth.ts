import { axiosInstance } from "./axios";

export const postSignup = async (signupData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/v1/auth/signup", signupData);
  return response.data;
};

export const postSignin = async (signinData: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/v1/auth/signin", signinData);
  const { accessToken, refreshToken } = response.data.data;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  return response.data;
};

export const postSignout = async () => {
  await axiosInstance.post("/v1/auth/signout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("nickname");
};

export const getMyInfo = async () => {
  const response = await axiosInstance.get("/v1/users/me");
  return response.data;
};

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  avatar?: string;
}

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const response = await axiosInstance.patch("/v1/users", payload);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await axiosInstance.delete("/v1/users");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("nickname");
  return response.data;
};
