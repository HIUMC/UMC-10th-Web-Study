import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

interface UpdateCommentParams {
  lpId: number;
  commentId: number;
  content: string;
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, commentId, content }: UpdateCommentParams) =>
      updateComment(lpId, commentId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, variables.lpId],
      });
    },
    onError: (error) => {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정에 실패했습니다.");
    },
  });
};
