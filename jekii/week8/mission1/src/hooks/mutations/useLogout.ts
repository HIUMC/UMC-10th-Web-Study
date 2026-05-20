import { useMutation } from "@tanstack/react-query";
import { postLogout } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";

function useLogout() {
  const { clearAuthTokens } = useAuth();

  return useMutation({
    mutationFn: postLogout,
    onSettled: () => {
      clearAuthTokens();
    },
  });
}

export default useLogout;
