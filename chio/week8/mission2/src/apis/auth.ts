import type {
  RequestPatchUserInfoDto,
  RequestSigninDto,
  RequestSignupDto,
  ResponseMyInfoDto,
  ResponseDeleteUserDto,
  ResponsePatchUserInfoDto,
  ResponseSigninDto,
  ResponseSignupDto,
} from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (body: RequestSignupDto):Promise<ResponseSignupDto> => {
  const {data} = await axiosInstance.post("/v1/auth/signup",body);
  return data;
}

export const postSignin = async (body: RequestSigninDto):Promise<ResponseSigninDto> => {
  const {data} = await axiosInstance.post("/v1/auth/signin",body,);
  return data;
}

export const postLogout = async () => {
  let token = localStorage.getItem("accessToken");
  if (token) token = token.replace(/"/g, "");

  const { data } = await axiosInstance.post(
    "/v1/auth/signout",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data;
};


export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");

  return data;
};

export const patchUserInfo = async (
  body: RequestPatchUserInfoDto,
): Promise<ResponsePatchUserInfoDto> => {
  const { data } = await axiosInstance.patch("/v1/users", body);

  return data;
};

export const deleteUser = async (): Promise<ResponseDeleteUserDto> => {
  const { data } = await axiosInstance.delete("/v1/users");

  return data;
};

