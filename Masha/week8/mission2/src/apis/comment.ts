import { authAxios } from "./axios";

export interface CreateCommentRequest {
  lpId: string;
  content: string;
}

export interface DeleteCommentRequest {
  lpId: string;
  commentId: number;
}

export const createComment = async ({ lpId, content }: CreateCommentRequest) => {
  const res = await authAxios.post(`/lps/${lpId}/comments`, {
    content,
  });

  return res.data;
};

export const deleteComment = async ({
  lpId,
  commentId,
}: DeleteCommentRequest) => {
  const res = await authAxios.delete(`/lps/${lpId}/comments/${commentId}`);

  return res.data;
};