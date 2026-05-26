import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { patchUserInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import type {
  RequestPatchUserInfoDto,
  ResponseMyInfoDto,
  ResponsePatchUserInfoDto,
} from "../../types/auth";

type PatchUserInfoMutationContext = {
  previousMyInfo?: ResponseMyInfoDto;
};

function usePatchUserInfo(
  options?: UseMutationOptions<
    ResponsePatchUserInfoDto,
    Error,
    RequestPatchUserInfoDto,
    PatchUserInfoMutationContext
  >,
) {
  const queryClient = useQueryClient();
  const myInfoQueryKey = [QUERY_KEY.myInfo] as const;

  return useMutation({
    mutationFn: patchUserInfo,
    ...options,
    onMutate: async (variables, context) => {
      await queryClient.cancelQueries({ queryKey: myInfoQueryKey });

      const previousMyInfo =
        queryClient.getQueryData<ResponseMyInfoDto>(myInfoQueryKey);

      queryClient.setQueryData<ResponseMyInfoDto>(myInfoQueryKey, (myInfo) => {
        if (!myInfo) {
          return myInfo;
        }

        return {
          ...myInfo,
          data: {
            ...myInfo.data,
            name: variables.name,
            ...(variables.bio !== undefined ? { bio: variables.bio } : {}),
            ...(variables.avatar !== undefined
              ? { avatar: variables.avatar }
              : {}),
          },
        };
      });

      await options?.onMutate?.(variables, context);

      return { previousMyInfo };
    },
    onError: (error, variables, onMutateResult, context) => {
      if (onMutateResult?.previousMyInfo) {
        queryClient.setQueryData(myInfoQueryKey, onMutateResult.previousMyInfo);
      }

      options?.onError?.(error, variables, onMutateResult, context);
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData(myInfoQueryKey, data);
      void queryClient.invalidateQueries({ queryKey: myInfoQueryKey });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export default usePatchUserInfo;
