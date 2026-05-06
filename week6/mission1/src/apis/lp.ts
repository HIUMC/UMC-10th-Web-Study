import { axiosInstance } from "./axios";
import type { PaginationDto } from "../types/common";
import type { ResponseLpDetailDto, ResponseLpListDto } from "../types/lp";

export const getLpList = async ({
  cursor = 0,
  limit = 10,
  search,
  order,
}: PaginationDto) => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: { cursor, limit, search, order },
  });
  return data as ResponseLpListDto;
};
export const getLpDetail = async (lpId: number) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data as ResponseLpDetailDto;
};
export const likeLp = async (lpId: number) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};
export const unlikeLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};
