import type {
  RequestCreateCommentDto,
  RequestGetCommentsDto,
  RequestUpdateCommentDto,
  ResponseCommentDto,
  ResponseGetCommentsDto,
} from "../types/comment";
import { axiosInstance } from "./axios";

export const getLpComments = async (
  lpid: number,
  params: RequestGetCommentsDto = {},
): Promise<ResponseGetCommentsDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}/comments`, {
    params,
  });
  return data;
};

export const createComment = async (
  lpid: number,
  body: RequestCreateCommentDto,
): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.post(
    `/v1/lps/${lpid}/comments`,
    body,
  );
  return data;
};

export const updateComment = async (
  lpid: number,
  commentId: number,
  body: RequestUpdateCommentDto,
): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpid}/comments/${commentId}`,
    body,
  );
  return data;
};

export const deleteComment = async (
  lpid: number,
  commentId: number,
): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpid}/comments/${commentId}`);
};
