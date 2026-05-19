import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { createComment } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type {
  RequestCreateCommentDto,
  ResponseCreateCommentDto,
} from "../../types/lps";

type CreateCommentVariables = {
  lpId: number;
  body: RequestCreateCommentDto;
};

function useCreateComment(
  options?: UseMutationOptions<
    ResponseCreateCommentDto,
    Error,
    CreateCommentVariables,
    unknown
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, body }) => createComment(lpId, body),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, variables.lpId],
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export default useCreateComment;
