import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";

function useDeleteUser() {
  const { clearAuthTokens } = useAuth();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      clearAuthTokens();
    },
  });
}

export default useDeleteUser;
