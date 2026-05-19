import { axiosInstance, axiosPublicInstance } from "./axios";
import type { PaginationDto } from "../types/commons";
import type {
  RequestCreateLpDto,
  RequestUpdateLpDto,
  ResponseCreateLpDto,
  ResponseDeleteLpDto,
  ResponseLpDetailDto,
  ResponseLpListDto,
  ResponseUpdateLpDto,
  RequestLpDto,
  ResponseLikeLpDto,
} from "../types/lp";

export const getLpList = async (
  paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
  const { data } = await axiosPublicInstance.get("/v1/lps", {
    params: paginationDto,
  });
  return data;
};

export const getLpDetail = async (
  lpId: string,
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosPublicInstance.get(`/v1/lps/${lpId}`);
  return data;
};

export const postLp = async (
  body: RequestCreateLpDto,
): Promise<ResponseCreateLpDto> => {
  const { data } = await axiosInstance.post("/v1/lps", body);
  return data;
};

export const patchLp = async (
  lpId: string,
  body: RequestUpdateLpDto,
): Promise<ResponseUpdateLpDto> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, body);
  return data;
};

export const deleteLp = async (lpId: string): Promise<ResponseDeleteLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

export const postLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

export const deleteLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};
