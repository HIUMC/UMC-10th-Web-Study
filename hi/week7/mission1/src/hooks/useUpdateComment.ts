import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateComment } from '../apis/comment';
import type { UpdateCommentPayload } from '../types/comment';

export const useUpdateComment = (lpId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      payload,
    }: {
      commentId: number;
      payload: UpdateCommentPayload;
    }) =>
      updateComment({
        lpId,
        commentId,
        payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', lpId] });
    },
    onError: () => {
      alert('댓글 수정에 실패했습니다.');
    },
  });
};