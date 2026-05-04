import axiosInstance from "./axios";
import type { PaginationDto } from "../types/common";
import type { LPDetailResponse, LPListResponse } from "../types/lp";

export type CreateLPRequest = {
  title: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  published: boolean;
};

export type UpdateLPRequest = {
  title?: string;
  content?: string;
  thumbnail?: string;
  tags?: string[];
  published?: boolean;
};

export const getLPs = async (
  paginationDto: PaginationDto
): Promise<LPListResponse> => {
  const { order, ...rest } = paginationDto;

  const { data } = await axiosInstance.get("/lps", {
    params: {
      ...rest,
      order: order === "popular" ? "desc" : order,
    },
  });

  if (order === "popular" && data?.data?.data) {
    data.data.data = [...data.data.data].sort(
      (a, b) => b.likes.length - a.likes.length
    );
  }

  return data;
};

export const getLPDetail = async (
  lpId: string
): Promise<LPDetailResponse> => {
  const { data } = await axiosInstance.get("/lps/" + lpId);
  return data;
};

export const createLP = async (body: CreateLPRequest) => {
  const { data } = await axiosInstance.post("/lps", body);
  return data;
};

export const updateLP = async (lpId: number, body: UpdateLPRequest) => {
  const { data } = await axiosInstance.patch("/lps/" + lpId, body);
  return data;
};

export const likeLP = async (lpId: number) => {
  const { data } = await axiosInstance.post("/lps/" + lpId + "/likes");
  return data;
};

export const unlikeLP = async (lpId: number) => {
  const { data } = await axiosInstance.delete("/lps/" + lpId + "/likes");
  return data;
};