import axiosInstance from "./axios";

export type RequestSigninDto = {
  email: string;
  password: string;
};

export const postSignin = async (signinData: RequestSigninDto) => {
  const { data } = await axiosInstance.post("/auth/signin", signinData);
  return data;
};

export const postLogout = async () => {
  const { data } = await axiosInstance.post("/auth/signout");
  return data;
};

export const getProtected = async () => {
  const { data } = await axiosInstance.get("/auth/protected");
  return data;
};