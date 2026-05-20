import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '../api/comment';

export const useDeleteComment = (lpId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) =>
      deleteComment({
        lpId,
        commentId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
    },
    onError: () => {
      alert('댓글 삭제에 실패했습니다.');
    },
  });
};