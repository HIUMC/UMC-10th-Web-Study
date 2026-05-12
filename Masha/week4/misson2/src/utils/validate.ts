export interface UserSigninInformation {
  email: string;
  password: string;
}

const emailRegex = /\S+@\S+\.\S+/;

export const validateLogin = (values: UserSigninInformation) => {
  const errors: { email?: string; password?: string } = {};

  if (!values.email) {
    errors.email = "이메일을 입력해주세요.";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "올바른 이메일 형식을 입력해주세요.";
  }

  if (!values.password) {
    errors.password = "비밀번호를 입력해주세요.";
  } else if (values.password.length < 8) {
    errors.password = "비밀번호는 8자 이상이어야 합니다.";
  }

  return errors;
};