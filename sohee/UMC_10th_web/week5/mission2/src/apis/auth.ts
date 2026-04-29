import axiosInstance from "./axiosInstance";

import type { 
    RequestSignupDto, ResponseSignupDto, 
    RequestSigninDto, ResponseSigninDto, 
    ResponseMyInfoDto 
} from "../types/auth";

export const postSignup = async (
    body: RequestSignupDto,
): Promise<ResponseSignupDto> => {
    const {data} = await axiosInstance.post("/v1/auth/signup", body);

    return data;
}

export const postSignin = async (
    body : RequestSigninDto,
): Promise<ResponseSigninDto> => {
    const {data} = await axiosInstance.post("/v1/auth/login", body);

    return data;
}

export const postLogout = async () => {
  const refreshTokenItem = localStorage.getItem("refreshToken");
  const refreshToken = refreshTokenItem ? JSON.parse(refreshTokenItem) : null;
  const {data} = await axiosInstance.post("/v1/auth/logout", { refreshToken })

  return data;
}

export const getMyInfo = async(): Promise<ResponseMyInfoDto> => {
    const {data} = await axiosInstance.get("/v1/users/me");

    return data;
}

export const postRefresh = async (refreshToken: string) => {
    const {data} = await axiosInstance.post("/v1/auth/refresh", {
        refreshToken,
    });
    return data;
}
