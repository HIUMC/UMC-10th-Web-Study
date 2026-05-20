import { useMutation } from "@tanstack/react-query";
import { postSignin } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";
import type { RequestSigninDto } from "../../types/auth";

function useLogin() {
  const { setAuthTokens } = useAuth();

  return useMutation({
    mutationFn: (body: RequestSigninDto) => postSignin(body),
    onSuccess: ({ data }) => {
      setAuthTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    },
  });
}

export default useLogin;
