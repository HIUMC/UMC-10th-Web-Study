import type {
  RequestGetLpsDto,
  ResponseGetLpDto,
  ResponseGetLpsDto,
} from "../types/lp";
import { axiosInstance } from "./axios";

export const getLps = async (
  params: RequestGetLpsDto = {},
): Promise<ResponseGetLpsDto> => {
  const { data } = await axiosInstance.get("/v1/lps", { params });
  return data;
};

export const getLpById = async (lpid: number): Promise<ResponseGetLpDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
  return data;
};
