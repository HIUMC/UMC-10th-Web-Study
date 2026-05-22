import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSignout } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const { handleLogout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: postSignout,
    onSuccess: () => {
      handleLogout();
      queryClient.clear();
      alert("로그아웃 되었습니다.");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.error("로그아웃 오류:", error);
      handleLogout();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
};
