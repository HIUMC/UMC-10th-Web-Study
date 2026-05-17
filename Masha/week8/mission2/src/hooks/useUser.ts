import { useMutation } from "@tanstack/react-query";
import { updateMyInfo } from "../apis/user";

export const useUpdateMyInfo = () => {
  return useMutation({
    mutationFn: updateMyInfo,
  });
};