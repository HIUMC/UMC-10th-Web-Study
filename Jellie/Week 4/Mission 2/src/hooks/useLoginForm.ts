import { useMemo, useState } from 'react';

export default function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailError = useMemo(function () {
    if (email.length === 0) {
      return '';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return '올바른 이메일 형식을 입력해주세요.';
    }

    return '';
  }, [email]);

  const passwordError = useMemo(function () {
    if (password.length === 0) {
      return '';
    }

    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }

    return '';
  }, [password]);

  const isFormValid =
    email.length > 0 &&
    password.length > 0 &&
    emailError.length === 0 &&
    passwordError.length === 0;

  return {
    email,
    password,
    setEmail,
    setPassword,
    emailError,
    passwordError,
    isFormValid,
  };
}