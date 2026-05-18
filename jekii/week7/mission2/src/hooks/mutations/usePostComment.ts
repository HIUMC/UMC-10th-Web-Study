import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment } from "../../apis/comment";

function usePostComment(lpId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => postComment({ lpId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
    },
  });
}

export default usePostComment;
