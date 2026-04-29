interface ApiResponse<T> {
  status: boolean;
  message: string;
  statusCode: number;
  data: T;
}

export interface RequestSignupDto {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
}

export interface ResponseSignupDto extends ApiResponse<{
  id: number;
  email: string;
  name: string;
  createdAt: string;
  accessToken: string;
  refreshToken: string;
}> {}

export interface RequestSigninDto {
  email: string;
  password: string;
}

export interface ResponseSigninDto extends ApiResponse<{
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}> {}

export interface ResponseMyInfoDto extends ApiResponse<{
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  avatar ?: string;
}> {}
