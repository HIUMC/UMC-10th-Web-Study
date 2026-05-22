import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export const usePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lpId: number) => postLike(lpId),
    onSuccess: (_, lpId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lpDetail, lpId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
    onError: (error) => {
      console.error("좋아요 추가 실패:", error);
    },
  });
};
