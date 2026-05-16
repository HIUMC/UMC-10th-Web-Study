import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { likeLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseLikeLpDto } from "../../types/lps";

type LikeLpVariables = {
  lpId: number;
};

function useLikeLp(
  options?: UseMutationOptions<
    ResponseLikeLpDto,
    Error,
    LikeLpVariables,
    unknown
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId }) => likeLp(lpId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpDetail, variables.lpId],
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export default useLikeLp;
