import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,
  });
}

export default useDeleteLike;
