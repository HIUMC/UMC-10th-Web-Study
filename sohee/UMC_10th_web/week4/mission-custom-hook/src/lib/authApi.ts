import type {
  AuthSession,
  RegisteredUser,
  SignInRequest,
  SignUpRequest,
} from '../types/auth';

type ApiResponse<TData> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: TData;
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

  const result = (await response.json()) as ApiResponse<AuthSession>;

  if (!response.ok || !result.status) {
    throw new Error(result.message || '로그인에 실패했습니다.');
  }

  return result.data;
};

export const signUp = async ({
  email,
  password,
  name,
  bio,
  avatar,
}: SignUpRequest) => {
  const response = await fetch(`${API_BASE_URL}/v1/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      name,
      bio,
      avatar,
    }),
  });

  const result = (await response.json()) as ApiResponse<RegisteredUser>;

  if (!response.ok || !result.status) {
    throw new Error(result.message || '회원가입에 실패했습니다.');
  }

  return result.data;
};
