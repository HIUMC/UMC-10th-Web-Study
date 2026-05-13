import { axiosInstance } from "./axios";
import type { PaginationDto } from "../types/common";
import type {
  RequestCommentDto,
  RequestCreateLpDto,
  RequestUpdateLpDto,
  ResponseCommentDto,
  ResponseCreateLpDto,
  ResponseLpCommentListDto,
  ResponseLpDetailDto,
  ResponseLpListDto,
  ResponseUpdateLpDto,
} from "../types/lp";

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

export const postLp = async (
  body: RequestCreateLpDto,
): Promise<ResponseCreateLpDto> => {
  const { data } = await axiosInstance.post("/v1/lps", body);
  return data;
};

export const patchLp = async ({
  lpId,
  body,
}: {
  lpId: number;
  body: RequestUpdateLpDto;
}): Promise<ResponseUpdateLpDto> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, body);
  return data;
};

export const deleteLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

export const getLpComments = async ({
  lpId,
  cursor = 0,
  limit = 10,
  order,
}: {
  lpId: number;
  cursor?: number;
  limit?: number;
  order?: string;
}) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { cursor, limit, order },
  });
  return data as ResponseLpCommentListDto;
};

export const postLpComment = async ({
  lpId,
  body,
}: {
  lpId: number;
  body: RequestCommentDto;
}): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, body);
  return data;
};

export const patchLpComment = async ({
  lpId,
  commentId,
  body,
}: {
  lpId: number;
  commentId: number;
  body: RequestCommentDto;
}): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    body,
  );
  return data;
};

export const deleteLpComment = async ({
  lpId,
  commentId,
}: {
  lpId: number;
  commentId: number;
}) => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`,
  );
  return data;
};

export const likeLp = async (lpId: number) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};
export const unlikeLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};
