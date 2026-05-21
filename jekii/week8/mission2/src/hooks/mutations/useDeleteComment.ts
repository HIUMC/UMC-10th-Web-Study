import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../apis/comment";

function useDeleteComment(lpId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment({ lpId, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
    },
  });
}

export default useDeleteComment;
