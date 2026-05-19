import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { createLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { RequestCreateLpDto, ResponseCreateLpDto } from "../../types/lps";

function useCreateLp(
  options?: UseMutationOptions<
    ResponseCreateLpDto,
    Error,
    RequestCreateLpDto,
    unknown
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLp,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export default useCreateLp;
