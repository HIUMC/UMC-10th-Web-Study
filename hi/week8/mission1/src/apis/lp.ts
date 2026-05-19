import axiosInstance from './axiosInstance';
import type {
  CreateLpPayload,
  LP,
  SortType,
  UpdateLpPayload,
} from '../types/lp';

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

interface LpMutationApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: LP;
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

export const createLp = async (
  payload: CreateLpPayload
): Promise<LpMutationApiResponse> => {
  const response = await axiosInstance.post<LpMutationApiResponse>(
    '/v1/lps',
    payload
  );

  return response.data;
};

export const updateLp = async ({
  lpId,
  payload,
}: {
  lpId: string;
  payload: UpdateLpPayload;
}): Promise<LpMutationApiResponse> => {
  const response = await axiosInstance.patch<LpMutationApiResponse>(
    `/v1/lps/${lpId}`,
    payload
  );

  return response.data;
};

export const deleteLp = async (lpId: string): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}`);
};

export const likeLp = async (lpId: string): Promise<void> => {
  await axiosInstance.post(`/v1/lps/${lpId}/likes`);
};

export const getMyLikedLps = async (order: 'asc' | 'desc') => {
  const response = await axiosInstance.get('/v1/lps/likes/me', {
    params: {
      order,
    },
  });

  return response.data.data;
};