import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import type { ResponseLpDetailDto } from "../../types/lp";

function useDeleteLike(lpId: string, userId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLike,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["lp", lpId] });

      const previousLpDetail = queryClient.getQueryData<ResponseLpDetailDto>([
        "lp",
        lpId,
      ]);

      queryClient.setQueryData<ResponseLpDetailDto>(["lp", lpId], (oldData) => {
        if (!oldData || userId === null) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            likes: oldData.data.likes.filter((like) => like.userId !== userId),
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

export default useDeleteLike;
