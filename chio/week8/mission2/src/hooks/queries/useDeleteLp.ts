import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { deleteLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseDeleteLpDto } from "../../types/lps";

type DeleteLpVariables = {
  lpId: number;
};

function useDeleteLp(
  options?: UseMutationOptions<
    ResponseDeleteLpDto,
    Error,
    DeleteLpVariables,
    unknown
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId }) => deleteLp(lpId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      void queryClient.removeQueries({
        queryKey: [QUERY_KEY.lpDetail, variables.lpId],
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export default useDeleteLp;
