import { axiosInstance, axiosPublicInstance } from "./axios";
import type { ResponseUploadImageDto } from "../types/upload";

const createImageFormData = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
};

export const uploadImage = async (
  file: File,
): Promise<ResponseUploadImageDto> => {
  const { data } = await axiosInstance.post(
    "/v1/uploads",
    createImageFormData(file),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

export const uploadPublicImage = async (
  file: File,
): Promise<ResponseUploadImageDto> => {
  const { data } = await axiosPublicInstance.post(
    "/v1/uploads/public",
    createImageFormData(file),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};
