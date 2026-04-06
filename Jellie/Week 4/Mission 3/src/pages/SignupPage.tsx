import googleLogo from '../assets/google-logo.png';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useLocalStorage from '../hooks/useLocalStorage';
import { signupSchema, type SignupFormValues } from '../schemas/auth';

export default function SignupPage() {
  const navigate = useNavigate();
  const [, setStoredAuth] = useLocalStorage('auth', {
    email: '',
    token: '',
    nickname: '',
    profileImage: '',
    isLoggedIn: false,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [profilePreview, setProfilePreview] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
    },
  });

  const email = watch('email');
  const password = watch('password');
  const passwordConfirm = watch('passwordConfirm');
  const nickname = watch('nickname');

  const goToStepTwo = async function () {
    const isEmailValid = await trigger('email');

    if (isEmailValid) {
      setStep(2);
    }
  };

  const goToStepThree = async function () {
    const isPasswordValid = await trigger(['password', 'passwordConfirm']);

    if (isPasswordValid) {
      setStep(3);
    }
  };

  const onSubmit = function (data: SignupFormValues) {
    setStoredAuth({
      email: data.email,
      token: 'mock-signup-token',
      nickname: data.nickname,
      profileImage: profilePreview,
      isLoggedIn: true,
    });

    alert('회원가입 완료');
    navigate('/');
  };

  const handleProfileChange = function (
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = function () {
      if (typeof reader.result === 'string') {
        setProfilePreview(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <section className='flex min-h-[calc(100vh-73px)] items-center justify-center bg-black px-6'>
      <div className='w-full max-w-sm'>
        <button
          type='button'
          onClick={function () {
            if (step === 1) {
              navigate(-1);
              return;
            }

            setStep(function (prev) {
              return prev - 1;
            });
          }}
          className='mb-6 text-xl text-white transition hover:text-lime-300'
        >
          {'<'}
        </button>

        <h1 className='mb-6 text-center text-2xl font-bold text-white'>회원가입</h1>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {step === 1 ? (
            <>
              <button
                type='button'
                className='flex w-full items-center justify-center gap-3 rounded-md border border-white/40 bg-white px-4 py-3 font-semibold text-black transition hover:bg-white/90'
              >
                <img src={googleLogo} alt='구글 로고' className='h-5 w-5 object-contain' />
                구글로 회원가입
              </button>

              <div className='flex items-center gap-3'>
                <div className='h-px flex-1 bg-white/30'></div>
                <span className='text-sm text-white/70'>OR</span>
                <div className='h-px flex-1 bg-white/30'></div>
              </div>

              <div>
                <input
                  type='text'
                  placeholder='이메일을 입력해주세요!'
                  {...register('email')}
                  className='w-full rounded-md border border-white/30 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-lime-300'
                />
                {errors.email ? (
                  <p className='mt-2 text-sm text-red-400'>{errors.email.message}</p>
                ) : null}
              </div>

              <button
                type='button'
                onClick={goToStepTwo}
                disabled={!email || !!errors.email}
                className={
                  'w-full rounded-md px-4 py-3 font-semibold transition ' +
                  (email && !errors.email
                    ? 'bg-lime-400 text-black hover:bg-lime-300'
                    : 'cursor-not-allowed bg-white/10 text-white/40')
                }
              >
                다음
              </button>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className='rounded-md bg-white/10 px-4 py-3 text-sm text-white'>
                {email}
              </div>

              <div>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='비밀번호를 입력해주세요!'
                    {...register('password')}
                    className='w-full rounded-md border border-white/30 bg-transparent px-4 py-3 pr-16 text-white outline-none placeholder:text-white/40 focus:border-lime-300'
                  />
                  <button
                    type='button'
                    onClick={function () {
                      setShowPassword(function (prev) {
                        return !prev;
                      });
                    }}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/70'
                  >
                    {showPassword ? '숨김' : '보기'}
                  </button>
                </div>
                {errors.password ? (
                  <p className='mt-2 text-sm text-red-400'>{errors.password.message}</p>
                ) : null}
              </div>

              <div>
                <div className='relative'>
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    placeholder='비밀번호를 다시 한 번 입력해주세요!'
                    {...register('passwordConfirm')}
                    className='w-full rounded-md border border-white/30 bg-transparent px-4 py-3 pr-16 text-white outline-none placeholder:text-white/40 focus:border-lime-300'
                  />
                  <button
                    type='button'
                    onClick={function () {
                      setShowPasswordConfirm(function (prev) {
                        return !prev;
                      });
                    }}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/70'
                  >
                    {showPasswordConfirm ? '숨김' : '보기'}
                  </button>
                </div>
                {errors.passwordConfirm ? (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.passwordConfirm.message}
                  </p>
                ) : null}
              </div>

              <button
                type='button'
                onClick={goToStepThree}
                disabled={
                  !password ||
                  !passwordConfirm ||
                  !!errors.password ||
                  !!errors.passwordConfirm
                }
                className={
                  'w-full rounded-md px-4 py-3 font-semibold transition ' +
                  (password &&
                  passwordConfirm &&
                  !errors.password &&
                  !errors.passwordConfirm
                    ? 'bg-lime-400 text-black hover:bg-lime-300'
                    : 'cursor-not-allowed bg-white/10 text-white/40')
                }
              >
                다음
              </button>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <div className='flex justify-center'>
                <button
                  type='button'
                  onClick={function () {
                    fileInputRef.current?.click();
                  }}
                  className='flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-white/20 text-5xl text-white/70 transition hover:bg-white/30'
                >
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt='프로필 미리보기'
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    '👤'
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleProfileChange}
                  className='hidden'
                />
              </div>

              <div>
                <input
                  type='text'
                  placeholder='닉네임을 입력해주세요!'
                  {...register('nickname')}
                  className='w-full rounded-md border border-white/30 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-lime-300'
                />
                {errors.nickname ? (
                  <p className='mt-2 text-sm text-red-400'>{errors.nickname.message}</p>
                ) : null}
              </div>

              <button
                type='submit'
                disabled={!nickname || !isValid}
                className={
                  'w-full rounded-md px-4 py-3 font-semibold transition ' +
                  (nickname && isValid
                    ? 'bg-lime-400 text-black hover:bg-lime-300'
                    : 'cursor-not-allowed bg-white/10 text-white/40')
                }
              >
                회원가입 완료
              </button>
            </>
          ) : null}
        </form>
      </div>
    </section>
  );
}