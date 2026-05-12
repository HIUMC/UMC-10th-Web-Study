import type { PaginationDto } from "../types/common";
import type {
  RequestCreateLpDto,
  ResponseCreateLpDto,
  ResponseLpCommentListDto,
  ResponseLpDetailDto,
  ResponseLpListDto,
  ResponseUploadImageDto,
} from "../types/lps";
import { axiosInstance } from "./axios";

export const getLpList = async (
  paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
};

export const getLpDetail = async (
  lpId: number,
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);

  return data;
};

export const getLpComments = async (
  lpId: number,
  paginationDto: PaginationDto,
): Promise<ResponseLpCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: paginationDto,
  });

  return data;
};

export const uploadLpImage = async (
  file: File,
): Promise<ResponseUploadImageDto> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosInstance.post("/v1/uploads", formData);

  return data;
};

export const createLp = async (
  createLpDto: RequestCreateLpDto,
): Promise<ResponseCreateLpDto> => {
  const { data } = await axiosInstance.post("/v1/lps", createLpDto);

  return data;
};
