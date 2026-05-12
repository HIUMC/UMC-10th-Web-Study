import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { uploadLpImage } from "../../apis/lp";
import type { ResponseUploadImageDto } from "../../types/lps";

function useUploadLpImage(
  options?: UseMutationOptions<ResponseUploadImageDto, Error, File>,
) {
  return useMutation({
    mutationFn: uploadLpImage,
    ...options,
  });
}

export default useUploadLpImage;
