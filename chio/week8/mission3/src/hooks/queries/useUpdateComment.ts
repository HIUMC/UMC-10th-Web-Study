import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { updateComment } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type {
  RequestUpdateCommentDto,
  ResponseUpdateCommentDto,
} from "../../types/lps";

type UpdateCommentVariables = {
  lpId: number;
  commentId: number;
  body: RequestUpdateCommentDto;
};

function useUpdateComment(
  options?: UseMutationOptions<
    ResponseUpdateCommentDto,
    Error,
    UpdateCommentVariables,
    unknown
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, commentId, body }) =>
      updateComment(lpId, commentId, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, variables.lpId],
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export default useUpdateComment;
