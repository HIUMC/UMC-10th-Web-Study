import axiosInstance from './axiosInstance';
import type { LP, SortType } from '../types/lp';

export interface LpListApiResponse {
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

interface LpCommentsApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: any[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

export const getLps = async ({
  cursor = 0,
  sort,
}: {
  cursor?: number;
  sort: SortType;
}): Promise<LpListApiResponse> => {
  const response = await axiosInstance.get<LpListApiResponse>('/v1/lps', {
    params: {
      cursor,
      limit: 10,
      order: sort,
    },
  });

  return response.data;
};

export const getLpDetail = async (lpid: string): Promise<LP> => {
  const response = await axiosInstance.get<LpDetailApiResponse>(
    `/v1/lps/${lpid}`
  );

  return response.data.data;
};

export const getLpComments = async ({
  lpId,
  cursor = 0,
  order,
}: {
  lpId: string;
  cursor?: number;
  order: 'asc' | 'desc';
}): Promise<LpCommentsApiResponse> => {
  const response = await axiosInstance.get<LpCommentsApiResponse>(
    `/v1/lps/${lpId}/comments`,
    {
      params: {
        cursor,
        order,
        limit: 10,
      },
    }
  );

  return response.data;
};