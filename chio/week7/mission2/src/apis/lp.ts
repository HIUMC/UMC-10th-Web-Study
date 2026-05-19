import type { PaginationDto, ResponseUploadImageDto } from "../types/common";
import type {
  RequestCreateCommentDto,
  RequestCreateLpDto,
  RequestUpdateCommentDto,
  RequestUpdateLpDto,
  ResponseCreateCommentDto,
  ResponseCreateLpDto,
  ResponseDeleteCommentDto,
  ResponseDeleteLpDto,
  ResponseLikeLpDto,
  ResponseLpCommentListDto,
  ResponseLpDetailDto,
  ResponseLpListDto,
  ResponseUnlikeLpDto,
  ResponseUpdateCommentDto,
  ResponseUpdateLpDto,
} from "../types/lps";
import { axiosInstance } from "./axios";

export const getLpList = async (
  paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
};

export const getLpDetail = async (
  lpId: number,
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);

  return data;
};

export const getLpComments = async (
  lpId: number,
  paginationDto: PaginationDto,
): Promise<ResponseLpCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: paginationDto,
  });

  return data;
};

export const uploadImage = async (
  file: File,
): Promise<ResponseUploadImageDto> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosInstance.post("/v1/uploads", formData);

  return data;
};

export const createLp = async (
  createLpDto: RequestCreateLpDto,
): Promise<ResponseCreateLpDto> => {
  const { data } = await axiosInstance.post("/v1/lps", createLpDto);

  return data;
};

export const updateLp = async (
  lpId: number,
  updateLpDto: RequestUpdateLpDto,
): Promise<ResponseUpdateLpDto> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, updateLpDto);

  return data;
};

export const deleteLp = async (lpId: number): Promise<ResponseDeleteLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);

  return data;
};

export const likeLp = async (lpId: number): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);

  return data;
};

export const unlikeLp = async (lpId: number): Promise<ResponseUnlikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);

  return data;
};

export const createComment = async (
  lpId: number,
  createCommentDto: RequestCreateCommentDto,
): Promise<ResponseCreateCommentDto> => {
  const { data } = await axiosInstance.post(
    `/v1/lps/${lpId}/comments`,
    createCommentDto,
  );

  return data;
};

export const updateComment = async (
  lpId: number,
  commentId: number,
  updateCommentDto: RequestUpdateCommentDto,
): Promise<ResponseUpdateCommentDto> => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    updateCommentDto,
  );

  return data;
};

export const deleteComment = async (
  lpId: number,
  commentId: number,
): Promise<ResponseDeleteCommentDto> => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`,
  );

  return data;
};
