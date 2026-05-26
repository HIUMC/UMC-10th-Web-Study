import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { postSignin } from "../../apis/auth";
import type { RequestSigninDto, ResponseSigninDto } from "../../types/auth";

function useSignin(
  options?: UseMutationOptions<ResponseSigninDto, Error, RequestSigninDto>,
) {
  return useMutation({
    mutationFn: postSignin,
    ...options,
  });
}

export default useSignin;
