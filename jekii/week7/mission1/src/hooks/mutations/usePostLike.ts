import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";

function usePostLike() {
  return useMutation({
    mutationFn: postLike,
  });
}

export default usePostLike;
