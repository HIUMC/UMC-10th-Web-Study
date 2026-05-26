import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { unlikeLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseMyInfoDto } from "../../types/auth";
import type { ResponseLpDetailDto, ResponseUnlikeLpDto } from "../../types/lps";

type UnlikeLpVariables = {
  lpId: number;
};

type UnlikeLpMutationContext = {
  previousLpDetail?: ResponseLpDetailDto;
};

function useUnlikeLp(
  options?: UseMutationOptions<
    ResponseUnlikeLpDto,
    Error,
    UnlikeLpVariables,
    UnlikeLpMutationContext
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId }) => unlikeLp(lpId),
    ...options,
    onMutate: async (variables, context) => {
      const lpDetailQueryKey = [QUERY_KEY.lpDetail, variables.lpId] as const;

      await queryClient.cancelQueries({ queryKey: lpDetailQueryKey });

      const previousLpDetail =
        queryClient.getQueryData<ResponseLpDetailDto>(lpDetailQueryKey);
      const myInfo = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);
      const currentUserId = myInfo?.data.id;

      queryClient.setQueryData<ResponseLpDetailDto>(
        lpDetailQueryKey,
        (lpDetail) => {
          if (!lpDetail || !currentUserId) {
            return lpDetail;
          }

          return {
            ...lpDetail,
            data: {
              ...lpDetail.data,
              likes: lpDetail.data.likes.filter(
                (like) => like.userId !== currentUserId,
              ),
            },
          };
        },
      );

      await options?.onMutate?.(variables, context);

      return { previousLpDetail };
    },
    onError: (error, variables, onMutateResult, context) => {
      if (onMutateResult?.previousLpDetail) {
        queryClient.setQueryData(
          [QUERY_KEY.lpDetail, variables.lpId],
          onMutateResult.previousLpDetail,
        );
      }

      options?.onError?.(error, variables, onMutateResult, context);
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      const lpDetailQueryKey = [QUERY_KEY.lpDetail, variables.lpId] as const;

      queryClient.setQueryData<ResponseLpDetailDto>(
        lpDetailQueryKey,
        (lpDetail) => {
          if (!lpDetail) {
            return lpDetail;
          }

          return {
            ...lpDetail,
            data: {
              ...lpDetail.data,
              likes: lpDetail.data.likes.filter(
                (like) => like.userId !== data.data.userId,
              ),
            },
          };
        },
      );
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      void queryClient.invalidateQueries({
        queryKey: lpDetailQueryKey,
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export default useUnlikeLp;
