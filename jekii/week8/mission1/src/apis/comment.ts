import { axiosInstance } from "./axios";
import type { PaginationDto } from "../types/commons";
import type {
  RequestCreateCommentDto,
  RequestDeleteCommentDto,
  RequestUpdateCommentDto,
  ResponseCreateCommentDto,
  ResponseDeleteCommentDto,
  ResponseCommentListDto,
  ResponseUpdateCommentDto,
} from "../types/comment";

export const getCommentList = async (
  lpId: string,
  paginationDto: PaginationDto,
): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: paginationDto,
  });

  return data;
};

export const postComment = async ({
  lpId,
  content,
}: RequestCreateCommentDto): Promise<ResponseCreateCommentDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });

  return data;
};

export const updateComment = async ({
  lpId,
  commentId,
  content,
}: RequestUpdateCommentDto): Promise<ResponseUpdateCommentDto> => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content },
  );

  return data;
};

export const deleteComment = async ({
  lpId,
  commentId,
}: RequestDeleteCommentDto): Promise<ResponseDeleteCommentDto> => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`,
  );

  return data;
};
