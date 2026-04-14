import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { signIn } from '../lib/authApi';
import { loginSchema } from '../lib/authSchema';
import { AUTH_STORAGE_KEYS, toStoredUser } from '../lib/authStorage';
import type { StoredUser } from '../lib/authStorage';
import type { LoginFormValues } from '../types/auth';

const AuthLoginPage = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, touchedFields },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError('');

    try {
      const session = await signIn(values);

      setAccessToken(session.accessToken);
      setRefreshToken(session.refreshToken);
      setCurrentUser(toStoredUser(session));

      navigate('/', { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : '로그인에 실패했습니다. 다시 시도해주세요.',
      );
    }
  };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.2),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#111827_55%,_#0f172a_100%)] px-5 py-6 text-white md:px-8 md:py-8">
      <button
        type="button"
        onClick={handleBackClick}
        className="mb-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-2xl text-white transition hover:border-amber-300 hover:text-amber-300"
        aria-label="이전 페이지로 이동"
      >
        &lt;
      </button>

      <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_460px]">
        <section className="hidden lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.42em] text-amber-300">
            Welcome Back
          </p>
          <h1 className="mt-5 text-6xl font-black leading-tight text-white">
            다시 로그인하고
            <br />
            영화 취향을
            <br />
            이어서 만나보세요
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            로그인 폼도 `react-hook-form`과 `zod`로 다시 구성해 입력 상태,
            에러 메시지, 제출 가능 여부를 한 번에 관리하도록 정리했습니다.
          </p>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-7 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur xl:p-9">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.36em] text-slate-400">
              Login
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
              계정에 로그인
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              이메일과 비밀번호를 입력하고 로그인 버튼을 눌러주세요.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                aria-invalid={Boolean(touchedFields.email && errors.email)}
                {...register('email')}
              />
              {touchedFields.email && errors.email ? (
                <p className="mt-2 text-sm text-rose-300">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                placeholder="6자 이상 입력해주세요"
                className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 ${
                  touchedFields.password && errors.password
                    ? 'border-rose-400 focus:border-rose-400'
                    : 'border-white/10 focus:border-amber-300'
                }`}
                aria-invalid={Boolean(touchedFields.password && errors.password)}
                {...register('password')}
              />
              {touchedFields.password && errors.password ? (
                <p className="mt-2 text-sm text-rose-300">
                  {errors.password.message}
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
              disabled={!isValid || isSubmitting}
              className="mt-2 flex w-full items-center justify-center rounded-2xl bg-amber-300 px-4 py-3 text-base font-black text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            아직 계정이 없나요?{' '}
            <Link to="/signup" className="font-semibold text-amber-300">
              회원가입하기
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default AuthLoginPage;
