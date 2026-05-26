import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../../apis/comment";

type UpdateCommentVariables = {
  commentId: number;
  content: string;
};

function useUpdateComment(lpId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: UpdateCommentVariables) =>
      updateComment({ lpId, commentId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
    },
  });
}

export default useUpdateComment;
