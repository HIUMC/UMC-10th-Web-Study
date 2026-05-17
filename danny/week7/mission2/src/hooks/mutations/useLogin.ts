import { useMutation } from "@tanstack/react-query";
import { postSignin } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import type { RequestSigninDto } from "../../types/auth";

type LocationState = {
  from?: string;
};

export const useLogin = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as LocationState | null)?.from || "/";

  return useMutation({
    mutationFn: (signInData: RequestSigninDto) => postSignin(signInData),
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;
      handleLogin(accessToken, refreshToken);
      navigate(from, { replace: true });
    },
    onError: (error) => {
      console.error("로그인 오류:", error);
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    },
  });
};
