import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { useNavigate } from "react-router-dom";

export const useDeleteLp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (lpId: number) => deleteLp(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      alert("게시글이 삭제되었습니다.");
      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.error("LP 삭제 실패:", error);
      alert("게시글 삭제에 실패했습니다.");
    },
  });
};
