import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { deleteComment } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseDeleteCommentDto } from "../../types/lps";

type DeleteCommentVariables = {
  lpId: number;
  commentId: number;
};

function useDeleteComment(
  options?: UseMutationOptions<
    ResponseDeleteCommentDto,
    Error,
    DeleteCommentVariables,
    unknown
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, commentId }) => deleteComment(lpId, commentId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, variables.lpId],
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export default useDeleteComment;
