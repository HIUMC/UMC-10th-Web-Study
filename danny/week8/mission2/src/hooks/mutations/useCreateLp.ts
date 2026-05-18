import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { RequestCreateLPDto } from "../../types/lp";

export const useCreateLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RequestCreateLPDto) => createLp(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      alert("LP가 성공적으로 생성되었습니다.");
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

      console.error("LP 생성 실패:", error);
      alert("LP 생성에 실패했습니다.");
    },
  });
};
