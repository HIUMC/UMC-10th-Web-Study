export interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface UserInfo {
  email: string;
  nickname: string;
  token: string;
}