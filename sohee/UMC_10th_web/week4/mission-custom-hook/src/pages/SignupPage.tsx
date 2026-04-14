import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { signIn, signUp } from '../lib/authApi';
import { emailSchema, passwordStepSchema, signUpSchema } from '../lib/authSchema';
import {
  AUTH_STORAGE_KEYS,
  toStoredUser,
  type StoredUser,
} from '../lib/authStorage';
import type { RegisteredUser, SignUpFormValues } from '../types/auth';

type SignUpStep = 1 | 2 | 3;

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
    <path
      d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
    <path
      d="M3 3l18 18"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.6 5.2A11.4 11.4 0 0 1 12 5c6.5 0 10 7 10 7a18.4 18.4 0 0 1-4.1 4.8"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.7 6.7C3.8 8.5 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignUpStep>(1);
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const { setValue: setAccessToken } = useLocalStorage<string | null>(
    AUTH_STORAGE_KEYS.accessToken,
    null,
  );
  const { setValue: setRefreshToken } = useLocalStorage<string | null>(
    AUTH_STORAGE_KEYS.refreshToken,
    null,
  );
  const { setValue: setCurrentUser } = useLocalStorage<StoredUser | null>(
    AUTH_STORAGE_KEYS.currentUser,
    null,
  );
  const { setValue: setRegisteredUser } = useLocalStorage<RegisteredUser | null>(
    AUTH_STORAGE_KEYS.registeredUser,
    null,
  );

  const {
    register,
    trigger,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
    },
  });

  const email = useWatch({ control, name: 'email' });
  const password = useWatch({ control, name: 'password' });
  const passwordConfirm = useWatch({ control, name: 'passwordConfirm' });
  const name = useWatch({ control, name: 'name' });

  const canGoToPasswordStep = emailSchema.safeParse({ email }).success;
  const canGoToProfileStep = passwordStepSchema.safeParse({
    password,
    passwordConfirm,
  }).success;
  const canCompleteSignUp = signUpSchema.safeParse({
    email,
    password,
    passwordConfirm,
    name,
  }).success;

  const goToNextStep = async () => {
    if (step === 1) {
      const isValid = await trigger('email');
      if (isValid) {
        setStep(2);
      }
      return;
    }

    if (step === 2) {
      const isValid = await trigger(['password', 'passwordConfirm']);
      if (isValid) {
        setStep(3);
      }
    }
  };

  const goToPreviousStep = () => {
    setSubmitError('');
    setStep((currentStep) => Math.max(1, currentStep - 1) as SignUpStep);
  };

  const onSubmit = async ({
    email,
    password,
    name,
  }: SignUpFormValues) => {
    setSubmitError('');

    try {
      const registeredUser = await signUp({ email, password, name });
      setRegisteredUser(registeredUser);

      try {
        const session = await signIn({ email, password });
        setAccessToken(session.accessToken);
        setRefreshToken(session.refreshToken);
        setCurrentUser(toStoredUser(session));
      } catch {
        setCurrentUser(toStoredUser(registeredUser));
      }

      navigate('/', { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : '회원가입에 실패했습니다. 다시 시도해주세요.',
      );
    }
  };

  const handleBackClick = () => {
    if (step > 1) {
      goToPreviousStep();
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#111827_60%,_#0f172a_100%)] px-5 py-6 text-white md:px-8 md:py-8">
      <button
        type="button"
        onClick={handleBackClick}
        className="mb-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-2xl text-white transition hover:border-amber-300 hover:text-amber-300"
        aria-label="이전 단계로 이동"
      >
        &lt;
      </button>

      <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_500px]">
        <section className="hidden lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.42em] text-amber-300">
            Sign Up
          </p>
          <h1 className="mt-5 text-6xl font-black leading-tight text-white">
            단계별로 천천히
            <br />
            안전한 회원가입을
            <br />
            완성해보세요
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            이메일, 비밀번호, 닉네임을 각각 검증하면서 다음 단계로 이동합니다.
            버튼 활성화 상태와 오류 메시지도 입력값에 맞춰 즉시 반영됩니다.
          </p>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-7 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur xl:p-9">
          <div className="mb-8">
            <div className="mb-5 flex items-center gap-3">
              {[1, 2, 3].map((order) => (
                <div
                  key={order}
                  className={`h-2 flex-1 rounded-full ${
                    order <= step ? 'bg-amber-300' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.36em] text-slate-400">
              Step {step}
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
              {step === 1 && '이메일 입력'}
              {step === 2 && '비밀번호 설정'}
              {step === 3 && '닉네임 설정'}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {step === 1 && '다음 단계로 넘어갈 수 있도록 이메일 형식을 먼저 확인합니다.'}
              {step === 2 && '비밀번호를 안전하게 설정하고 같은 값인지 다시 확인해주세요.'}
              {step === 3 && '마지막으로 닉네임을 입력하고 회원가입을 완료합니다.'}
            </p>
          </div>

          {(step === 2 || step === 3) && (
            <div className="mb-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
                입력한 이메일
              </p>
              <p className="mt-2 text-sm font-semibold text-white">{email}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {step === 1 ? (
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-200"
                  >
                    이메일
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 ${
                      touchedFields.email && errors.email
                        ? 'border-rose-400 focus:border-rose-400'
                        : 'border-white/10 focus:border-amber-300'
                    }`}
                    {...register('email')}
                  />
                  {touchedFields.email && errors.email ? (
                    <p className="mt-2 text-sm text-rose-300">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!canGoToPasswordStep}
                  className="flex w-full items-center justify-center rounded-2xl bg-amber-300 px-4 py-3 text-base font-black text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                  다음
                </button>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-200"
                  >
                    비밀번호
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="6자 이상 입력해주세요"
                      className={`w-full rounded-2xl border bg-white/5 px-4 py-3 pr-14 text-white outline-none transition placeholder:text-slate-500 ${
                        touchedFields.password && errors.password
                          ? 'border-rose-400 focus:border-rose-400'
                          : 'border-white/10 focus:border-amber-300'
                      }`}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 transition hover:text-amber-300"
                      aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {touchedFields.password && errors.password ? (
                    <p className="mt-2 text-sm text-rose-300">
                      {errors.password.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="passwordConfirm"
                    className="mb-2 block text-sm font-semibold text-slate-200"
                  >
                    비밀번호 재확인
                  </label>
                  <div className="relative">
                    <input
                      id="passwordConfirm"
                      type={showPasswordConfirm ? 'text' : 'password'}
                      placeholder="비밀번호를 한 번 더 입력해주세요"
                      className={`w-full rounded-2xl border bg-white/5 px-4 py-3 pr-14 text-white outline-none transition placeholder:text-slate-500 ${
                        touchedFields.passwordConfirm && errors.passwordConfirm
                          ? 'border-rose-400 focus:border-rose-400'
                          : 'border-white/10 focus:border-amber-300'
                      }`}
                      {...register('passwordConfirm')}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordConfirm((current) => !current)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 transition hover:text-amber-300"
                      aria-label={
                        showPasswordConfirm
                          ? '비밀번호 확인 숨기기'
                          : '비밀번호 확인 보이기'
                      }
                    >
                      {showPasswordConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {touchedFields.passwordConfirm && errors.passwordConfirm ? (
                    <p className="mt-2 text-sm text-rose-300">
                      {errors.passwordConfirm.message}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!canGoToProfileStep}
                  className="flex w-full items-center justify-center rounded-2xl bg-amber-300 px-4 py-3 text-base font-black text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                  다음
                </button>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-5">
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Profile Preview
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-white/20 bg-slate-900 text-lg font-black text-amber-300">
                      {name ? name.slice(0, 1).toUpperCase() : '+'}
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">프로필 이미지 UI</p>
                      <p className="mt-1 text-base font-semibold text-white">
                        추후 업로드 기능이 들어갈 자리입니다
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-200"
                  >
                    닉네임
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="2자 이상 20자 이하로 입력해주세요"
                    className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 ${
                      touchedFields.name && errors.name
                        ? 'border-rose-400 focus:border-rose-400'
                        : 'border-white/10 focus:border-amber-300'
                    }`}
                    {...register('name')}
                  />
                  {touchedFields.name && errors.name ? (
                    <p className="mt-2 text-sm text-rose-300">
                      {errors.name.message}
                    </p>
                  ) : null}
                </div>

                {submitError ? (
                  <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {submitError}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={!canCompleteSignUp || isSubmitting}
                  className="flex w-full items-center justify-center rounded-2xl bg-amber-300 px-4 py-3 text-base font-black text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                  {isSubmitting ? '회원가입 처리 중...' : '회원가입 완료'}
                </button>
              </div>
            ) : null}
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            이미 계정이 있나요?{' '}
            <Link to="/login" className="font-semibold text-amber-300">
              로그인하기
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default SignupPage;
