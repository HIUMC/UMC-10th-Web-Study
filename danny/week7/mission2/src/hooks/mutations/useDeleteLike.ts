import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export const useDeleteLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lpId: number) => deleteLike(lpId),
    onSuccess: (_, lpId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lpDetail, lpId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
    onError: (error) => {
      console.error("좋아요 취소 실패:", error);
    },
  });
};
