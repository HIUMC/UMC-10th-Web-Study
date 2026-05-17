import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

interface DeleteCommentParams {
  lpId: number;
  commentId: number;
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, commentId }: DeleteCommentParams) =>
      deleteComment(lpId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, variables.lpId],
      });
    },
    onError: (error) => {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다.");
    },
  });
};
