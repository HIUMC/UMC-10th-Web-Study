import type {
  RequestSigninDto,
  RequestSignupDto,
  ResponseMyInfoDto,
  ResponseSigninDto,
  ResponseSignupDto,
} from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (
  body: RequestSignupDto,
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signup", body);
  return data;
};

export const postSignin = async (
  body: RequestSigninDto,
): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);
  return data;
};

export const postLogout = async () => {
  let token = localStorage.getItem("accessToken");
  if (token) token = token.replace(/"/g, "");

  const { data } = await axiosInstance.post(
    "/v1/auth/signout",
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  let token = localStorage.getItem("accessToken");
  if (token) {
    token = token.replace(/"/g, ""); // 따옴표 제거
  }

  console.log("👉 최종 보낼 토큰:", token);

  const { data } = await axiosInstance.get("/v1/users/me", {
    headers: {
      Authorization: `Bearer ${token}`, // 여기 반드시 추가!
    },
  });

  return data;
};
