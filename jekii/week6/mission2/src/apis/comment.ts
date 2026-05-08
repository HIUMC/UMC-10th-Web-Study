import { axiosInstance } from "./axios";
import type { PaginationDto } from "../types/commons";
import type { ResponseCommentListDto } from "../types/comment";

export const getCommentList = async (
  lpId: string,
  paginationDto: PaginationDto,
): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: paginationDto,
  });

  return data;
};
