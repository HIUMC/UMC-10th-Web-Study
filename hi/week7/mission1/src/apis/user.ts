import axiosInstance from './axiosInstance';
import type { UpdateProfilePayload, User } from '../types/user';

interface UserApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: User;
}

export const getMyInfo = async (): Promise<User> => {
  const response = await axiosInstance.get<UserApiResponse>('/v1/users/me');

  return response.data.data;
};

export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<UserApiResponse> => {
  const response = await axiosInstance.patch<UserApiResponse>(
    '/v1/users',
    payload
  );

  return response.data;
};

export const deleteUser = async (): Promise<void> => {
  await axiosInstance.delete('/v1/users');
};