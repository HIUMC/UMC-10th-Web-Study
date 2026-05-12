import type {
  RequestGetCommentsDto,
  ResponseGetCommentsDto,
} from "../types/comment";
import { axiosInstance } from "./axios";

export const getLpComments = async (
  lpid: number,
  params: RequestGetCommentsDto = {},
): Promise<ResponseGetCommentsDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}/comments`, {
    params,
  });
  return data;
};
