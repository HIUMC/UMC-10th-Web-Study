import axiosInstance from './axiosInstance';
import type { UpdateProfilePayload, User } from '../types/user';

interface UserApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: User;
}

export const getMyProfile = async (): Promise<User> => {
  const response = await axiosInstance.get<UserApiResponse>('/v1/users/me');
  return response.data.data;
};

export const getMyInfo = getMyProfile;

export const updateMyProfile = async (
  payload: UpdateProfilePayload,
): Promise<User> => {
  const response = await axiosInstance.patch<UserApiResponse>(
    '/v1/users',
    payload,
  );

  return response.data.data;
};

export const deleteUser = async (): Promise<void> => {
  await axiosInstance.delete('/v1/users');
};