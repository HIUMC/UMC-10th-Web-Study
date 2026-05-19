import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { likeLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseMyInfoDto } from "../../types/auth";
import type { ResponseLikeLpDto, ResponseLpDetailDto } from "../../types/lps";

type LikeLpVariables = {
  lpId: number;
};

type LikeLpMutationContext = {
  previousLpDetail?: ResponseLpDetailDto;
};

function useLikeLp(
  options?: UseMutationOptions<
    ResponseLikeLpDto,
    Error,
    LikeLpVariables,
    LikeLpMutationContext
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId }) => likeLp(lpId),
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
          if (
            !lpDetail ||
            !currentUserId ||
            lpDetail.data.likes.some((like) => like.userId === currentUserId)
          ) {
            return lpDetail;
          }

          return {
            ...lpDetail,
            data: {
              ...lpDetail.data,
              likes: [
                ...lpDetail.data.likes,
                {
                  id: -Date.now(),
                  lpId: variables.lpId,
                  userId: currentUserId,
                },
              ],
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

          const likes = lpDetail.data.likes.some(
            (like) => like.userId === data.data.userId,
          )
            ? lpDetail.data.likes.map((like) =>
                like.userId === data.data.userId ? data.data : like,
              )
            : [...lpDetail.data.likes, data.data];

          return {
            ...lpDetail,
            data: {
              ...lpDetail.data,
              likes,
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

export default useLikeLp;
