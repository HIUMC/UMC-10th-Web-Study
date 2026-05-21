import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../../apis/upload";

function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadImage(file),
  });
}

export default useUploadImage;
