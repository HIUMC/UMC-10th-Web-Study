import { axiosInstance } from "./axios";
import type {
  CommentListResponse,
  LPDetailResponse,
  LPListResponse,
  RequestCreateLPDto,
  RequestUpdateLPDto,
} from "../types/lp";

export const getLpList = async (order: "asc" | "desc", cursor?: number) => {
  const { data } = await axiosInstance.get<LPListResponse>("/v1/lps", {
    params: { cursor: cursor ?? 0, limit: 30, order },
  });
  return data.data;
};

export const getLpDetail = async (lpId: number) => {
  const { data } = await axiosInstance.get<LPDetailResponse>(`/v1/lps/${lpId}`);
  return data.data;
};

export const createLp = async (payload: RequestCreateLPDto) => {
  const { data } = await axiosInstance.post("/v1/lps", payload);
  return data;
};

export const updateLp = async (lpId: number, payload: RequestUpdateLPDto) => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, payload);
  return data;
};

export const deleteLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

export const postLike = async (lpId: number) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

export const deleteLike = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};

export const getComments = async (
  lpId: number,
  order: "asc" | "desc",
  cursor?: number,
) => {
  const { data } = await axiosInstance.get<CommentListResponse>(
    `/v1/lps/${lpId}/comments`,
    {
      params: { cursor: cursor ?? 0, limit: 10, order },
    },
  );
  return data.data;
};

export const createComment = async (lpId: number, content: string) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });
  return data;
};

export const updateComment = async (
  lpId: number,
  commentId: number,
  content: string,
) => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content },
  );
  return data;
};

export const deleteComment = async (lpId: number, commentId: number) => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`,
  );
  return data;
};
