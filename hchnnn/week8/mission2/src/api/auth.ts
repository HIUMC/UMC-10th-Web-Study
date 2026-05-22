import axiosInstance from './axiosInstance';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    name?: string;
    nickname?: string;
  };
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    '/v1/auth/signin',
    payload
  );

  return response.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/v1/auth/signout');
};