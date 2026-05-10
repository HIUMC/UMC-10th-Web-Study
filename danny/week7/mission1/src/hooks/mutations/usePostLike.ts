import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export const usePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lpId: number) => postLike(lpId),

    onSuccess: async (_, lpId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lpDetail, lpId] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] }),
      ]);
    },

    onError: async (error, lpId) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 409) {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEY.lpDetail, lpId],
            }),
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] }),
          ]);

          alert("좋아요 상태를 다시 불러왔습니다. 화면을 확인해주세요.");
          return;
        }

        if (Array.isArray(message)) {
          alert(message.join("\n"));
          return;
        }

        if (typeof message === "string") {
          alert(message);
          return;
        }
      }

      console.error("좋아요 추가 실패:", error);
      alert("좋아요 추가에 실패했습니다.");
    },
  });
};
