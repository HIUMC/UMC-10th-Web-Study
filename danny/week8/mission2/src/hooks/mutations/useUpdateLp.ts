import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { RequestUpdateLPDto } from "../../types/lp";

interface UpdateLpParams {
  lpId: number;
  payload: RequestUpdateLPDto;
}

export const useUpdateLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, payload }: UpdateLpParams) => updateLp(lpId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpDetail, variables.lpId],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      alert("게시글이 수정되었습니다.");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          alert(message.join("\n"));
          return;
        }

        if (typeof message === "string") {
          alert(message);
          return;
        }
      }

      console.error("LP 수정 실패:", error);
      alert("게시글 수정에 실패했습니다.");
    },
  });
};
