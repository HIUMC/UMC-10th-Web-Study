export type LoginFormValues = {
  email: string;
  password: string;
};

export type SignUpFormValues = {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
};

export type SignInRequest = LoginFormValues;

export type SignUpRequest = {
  email: string;
  password: string;
  name: string;
  bio?: string;
  avatar?: string;
};

export type AuthSession = {
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
};

export type RegisteredUser = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};
