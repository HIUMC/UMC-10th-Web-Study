import axiosInstance from './axiosInstance';
import type { LP, SortType } from '../types/lp';

interface LpListApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: LP[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

interface LpDetailApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: LP;
}

export const getLps = async (sort: SortType): Promise<LP[]> => {
  const response = await axiosInstance.get<LpListApiResponse>('/v1/lps', {
    params: {
      cursor: 0,
      limit: 10,
      order: sort,
    },
  });

  return response.data.data.data;
};

export const getLpDetail = async (lpid: string): Promise<LP> => {
  const response = await axiosInstance.get<LpDetailApiResponse>(
    `/v1/lps/${lpid}`
  );

  return response.data.data;
};