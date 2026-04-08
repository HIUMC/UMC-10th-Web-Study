type SignInRequest = {
  email: string;
  password: string;
};

type SignInResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
  };
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export const signIn = async ({ email, password }: SignInRequest) => {
  const response = await fetch(`${API_BASE_URL}/v1/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const result = (await response.json()) as SignInResponse;

  if (!response.ok || !result.status) {
    throw new Error(result.message || '로그인에 실패했습니다.');
  }

  return result.data;
};
