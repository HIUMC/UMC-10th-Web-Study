import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { signupSchema, type SignupSchemaType } from '../schemas/authSchema';
import useLocalStorage from '../hooks/useLocalStorage';
import type { UserInfo } from '../types/auth';

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { setValue: setUser } = useLocalStorage<UserInfo | null>('user', null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
    },
  });

  const email = watch('email');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const nickname = watch('nickname');

  const handleNextEmail = async () => {
    const valid = await trigger('email');
    if (valid) setStep(2);
  };

  const handleNextPassword = async () => {
    const valid = await trigger(['password', 'confirmPassword']);
    if (valid) setStep(3);
  };

  const onSubmit = (data: SignupSchemaType) => {
    setUser({
      email: data.email,
      nickname: data.nickname,
      token: `token_${Date.now()}`,
    });

    alert('회원가입이 완료되었습니다.');
    navigate('/');
  };

  const isEmailValid =
    !!email &&
    !errors.email &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isPasswordValid =
    !!password &&
    !!confirmPassword &&
    password.length >= 6 &&
    password === confirmPassword &&
    !errors.password &&
    !errors.confirmPassword;

  const isNicknameValid =
    !!nickname &&
    nickname.length >= 2 &&
    nickname.length <= 10 &&
    !errors.nickname;

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-title-row">
          <button
            type="button"
            className="back-button"
            onClick={() => {
              if (step === 1) navigate(-1);
              else setStep((prev) => (prev - 1) as 1 | 2 | 3);
            }}
          >
            &lt;
          </button>
          <h1 className="login-title">회원가입</h1>
        </div>

        {step === 1 && (
          <>
            <button type="button" className="google-login-button">
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="google"
                className="google-icon"
              />
              구글 로그인
            </button>

            <div className="or-divider">
              <span className="divider-line" />
              <span className="or-text">OR</span>
              <span className="divider-line" />
            </div>

            <form className="login-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="이메일을 입력해주세요!"
                  {...register('email')}
                  className="login-input"
                />
                {errors.email && (
                  <p className="error-text" style={{ textAlign: 'center' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                disabled={!isEmailValid}
                className="login-button"
                onClick={handleNextEmail}
              >
                다음
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <form className="login-form">
            <div className="input-group">
              <input
                type="text"
                value={email}
                readOnly
                className="login-input"
              />
            </div>

            <div className="input-group">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #6d6d6d',
                  borderRadius: '6px',
                  backgroundColor: '#111',
                }}
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력해주세요!"
                  {...register('password')}
                  className="login-input"
                  style={{ border: 'none', flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    padding: '0 12px',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? '숨김' : '보기'}
                </button>
              </div>
              {errors.password && (
                <p className="error-text" style={{ textAlign: 'center' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="input-group">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #6d6d6d',
                  borderRadius: '6px',
                  backgroundColor: '#111',
                }}
              >
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 다시 입력해주세요!"
                  {...register('confirmPassword')}
                  className="login-input"
                  style={{ border: 'none', flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    padding: '0 12px',
                    cursor: 'pointer',
                  }}
                >
                  {showConfirmPassword ? '숨김' : '보기'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-text" style={{ textAlign: 'center' }}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={!isPasswordValid}
              className="login-button"
              onClick={handleNextPassword}
            >
              다음
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group">
              <input
                type="text"
                value={email}
                readOnly
                className="login-input"
              />
            </div>

            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '6px',
              }}
            >
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '9999px',
                  backgroundColor: '#1b1b1f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                }}
              >
                🙂
              </div>
              <p style={{ fontSize: '12px', color: '#8f8f8f' }}>프로필 이미지 UI</p>
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="닉네임을 입력해주세요!"
                {...register('nickname')}
                className="login-input"
              />
              {errors.nickname && (
                <p className="error-text" style={{ textAlign: 'center' }}>
                  {errors.nickname.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isNicknameValid || !isValid}
              className="login-button"
            >
              회원가입 완료
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupPage;