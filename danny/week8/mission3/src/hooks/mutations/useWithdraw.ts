import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccount } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useWithdraw = () => {
  const { handleLogout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      handleLogout();
      queryClient.clear();
      alert("회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.error("회원 탈퇴 오류:", error);
      alert("탈퇴 처리 중 문제가 발생했습니다.");
    },
  });
};
