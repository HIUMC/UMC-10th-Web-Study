import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../apis/comment';
import type { CreateCommentPayload } from '../types/comment';

export const useCreateComment = (lpId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      createComment({
        lpId,
        payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
    },
    onError: () => {
      alert('댓글 작성에 실패했습니다.');
    },
  });
};