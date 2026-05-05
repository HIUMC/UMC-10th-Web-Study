export type UserSigninInformation = {
  email: string;
  password: string;
};

export type UserSignupInformation = {
  email: string;
  password: string;
  passwordCheck: string;
  nickname: string;
};

function validateUser(values: UserSigninInformation) {
  const errors: { email: string; password: string } = {
    email: "",
    password: "",
  };

  if (
    !/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/.test(
      values.email,
    )
  ) {
    errors.email = "올바른 이메일 형식이 아닙니다!";
  }

  if (!(values.password.length >= 8 && values.password.length <= 20)) {
    errors.password = "비밀번호는 8~20자 사이로 입력해주세요.";
  }

  return errors;
}

function validateSignin(values: UserSigninInformation) {
  return validateUser(values);
}

function validateSignup(values: UserSignupInformation) {
  const errors: {
    email: string;
    password: string;
    passwordCheck: string;
    nickname: string;
  } = {
    email: "",
    password: "",
    passwordCheck: "",
    nickname: "",
  };

  if (
    !/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/.test(
      values.email,
    )
  ) {
    errors.email = "올바른 이메일 형식이 아닙니다!";
  }

  if (!(values.password.length >= 8 && values.password.length <= 20)) {
    errors.password = "비밀번호는 8~20자 사이로 입력해주세요.";
  }

  if (values.passwordCheck !== values.password) {
    errors.passwordCheck = "비밀번호가 일치하지 않습니다.";
  }

  if (values.nickname.trim() === "") {
    errors.nickname = "닉네임을 입력해주세요.";
  }

  return errors;
}

export { validateSignin, validateSignup };