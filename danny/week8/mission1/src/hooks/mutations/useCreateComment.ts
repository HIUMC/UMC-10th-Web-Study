import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

interface CreateCommentParams {
  lpId: number;
  content: string;
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, content }: CreateCommentParams) =>
      createComment(lpId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, variables.lpId],
      });
    },
    onError: (error) => {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    },
  });
};
