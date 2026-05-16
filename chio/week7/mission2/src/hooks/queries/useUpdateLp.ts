import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { updateLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { RequestUpdateLpDto, ResponseUpdateLpDto } from "../../types/lps";

type UpdateLpVariables = {
  lpId: number;
  body: RequestUpdateLpDto;
};

function useUpdateLp(
  options?: UseMutationOptions<
    ResponseUpdateLpDto,
    Error,
    UpdateLpVariables,
    unknown
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, body }) => updateLp(lpId, body),
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

export default useUpdateLp;
