import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { patchUserInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import type {
  RequestPatchUserInfoDto,
  ResponsePatchUserInfoDto,
} from "../../types/auth";

function usePatchUserInfo(
  options?: UseMutationOptions<
    ResponsePatchUserInfoDto,
    Error,
    RequestPatchUserInfoDto,
    unknown
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchUserInfo,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData([QUERY_KEY.myInfo], data);
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export default usePatchUserInfo;
