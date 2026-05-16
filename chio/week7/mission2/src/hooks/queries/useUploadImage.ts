import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { uploadImage } from "../../apis/lp";
import type { ResponseUploadImageDto } from "../../types/common";

function useUploadImage(
  options?: UseMutationOptions<ResponseUploadImageDto, Error, File>,
) {
  return useMutation({
    mutationFn: uploadImage,
    ...options,
  });
}

export default useUploadImage;
