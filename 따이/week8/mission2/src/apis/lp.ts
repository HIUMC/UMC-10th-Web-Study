import type {
  RequestCreateLpDto,
  RequestGetLpsDto,
  RequestUpdateLpDto,
  ResponseCreateLpDto,
  ResponseDeleteLpDto,
  ResponseGetLpDto,
  ResponseGetLpsDto,
  ResponseToggleLikeDto,
} from "../types/lp";
import { axiosInstance } from "./axios";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post("/v1/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // 서버 응답 구조에 따라 URL 추출
  return data?.data?.imageUrl ?? data?.imageUrl ?? data?.url ?? data;
};

export const getLps = async (
  params: RequestGetLpsDto = {},
): Promise<ResponseGetLpsDto> => {
  const { data } = await axiosInstance.get("/v1/lps", { params });
  return data;
};

export const getLpById = async (lpid: number): Promise<ResponseGetLpDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
  return data;
};

export const createLp = async (
  body: RequestCreateLpDto,
): Promise<ResponseCreateLpDto> => {
  const { data } = await axiosInstance.post("/v1/lps", body);
  return data;
};

export const updateLp = async (
  lpid: number,
  body: RequestUpdateLpDto,
): Promise<ResponseCreateLpDto> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpid}`, body);
  return data;
};

export const deleteLp = async (
  lpid: number,
): Promise<ResponseDeleteLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpid}`);
  return data;
};

export const addLike = async (
  lpid: number,
): Promise<ResponseToggleLikeDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpid}/likes`);
  return data;
};

export const deleteLike = async (
  lpid: number,
): Promise<ResponseToggleLikeDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpid}/likes`);
  return data;
};

export const getMyLps = async (
  params: RequestGetLpsDto = {},
): Promise<ResponseGetLpsDto> => {
  const { data } = await axiosInstance.get("/v1/lps/user", { params });
  return data;
};

export const getLikedLps = async (
  params: RequestGetLpsDto = {},
): Promise<ResponseGetLpsDto> => {
  const { data } = await axiosInstance.get("/v1/lps/likes/me", { params });
  return data;
};
