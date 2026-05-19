import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import type { ResponseLpDetailDto } from "../../types/lp";

function usePostLike(lpId: string, userId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLike,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["lp", lpId] });

      const previousLpDetail = queryClient.getQueryData<ResponseLpDetailDto>([
        "lp",
        lpId,
      ]);

      queryClient.setQueryData<ResponseLpDetailDto>(["lp", lpId], (oldData) => {
        if (!oldData || userId === null) return oldData;

        const alreadyLiked = oldData.data.likes.some(
          (like) => like.userId === userId,
        );

        if (alreadyLiked) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            likes: [
              ...oldData.data.likes,
              {
                id: -Date.now(),
                userId,
                lpId: Number(lpId),
              },
            ],
          },
        };
      });

      return { previousLpDetail };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousLpDetail) {
        queryClient.setQueryData(["lp", lpId], context.previousLpDetail);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
    },
  });
}

export default usePostLike;
