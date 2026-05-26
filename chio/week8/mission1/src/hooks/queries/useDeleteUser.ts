import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { deleteUser } from "../../apis/auth";
import type { ResponseDeleteUserDto } from "../../types/auth";

function useDeleteUser(
  options?: UseMutationOptions<ResponseDeleteUserDto, Error, void, unknown>,
) {
  return useMutation({
    mutationFn: deleteUser,
    ...options,
  });
}

export default useDeleteUser;
