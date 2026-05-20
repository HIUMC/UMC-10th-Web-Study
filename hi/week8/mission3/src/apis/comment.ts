import axiosInstance from './axiosInstance';
import type {
  Comment,
  CreateCommentPayload,
  UpdateCommentPayload,
} from '../types/comment';

interface CommentMutationApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: Comment;
}

export const createComment = async ({
  lpId,
  payload,
}: {
  lpId: string;
  payload: CreateCommentPayload;
}): Promise<CommentMutationApiResponse> => {
  const response = await axiosInstance.post<CommentMutationApiResponse>(
    `/v1/lps/${lpId}/comments`,
    payload
  );

  return response.data;
};

export const updateComment = async ({
  lpId,
  commentId,
  payload,
}: {
  lpId: string;
  commentId: number;
  payload: UpdateCommentPayload;
}): Promise<CommentMutationApiResponse> => {
  const response = await axiosInstance.patch<CommentMutationApiResponse>(
    `/v1/lps/${lpId}/comments/${commentId}`,
    payload
  );

  return response.data;
};

export const deleteComment = async ({
  lpId,
  commentId,
}: {
  lpId: string;
  commentId: number;
}): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};