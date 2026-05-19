import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { unlikeLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseUnlikeLpDto } from "../../types/lps";

type UnlikeLpVariables = {
  lpId: number;
};

function useUnlikeLp(
  options?: UseMutationOptions<
    ResponseUnlikeLpDto,
    Error,
    UnlikeLpVariables,
    unknown
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId }) => unlikeLp(lpId),
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

export default useUnlikeLp;
