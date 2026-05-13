import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { signIn } from '../lib/auth';

type LoginFormValues = {
  email: string;
  password: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');

  const { errors, touched, isValid, isSubmitting, register, handleSubmit } =
    useForm<LoginFormValues>({
      initialValues: {
        email: '',
        password: '',
      },
      validators: {
        email: (value) => {
          if (!value.trim()) {
            return '이메일을 입력해주세요.';
          }

          if (!emailRegex.test(value)) {
            return '유효하지 않은 이메일 형식입니다.';
          }

          return '';
        },
        password: (value) => {
          if (!value.trim()) {
            return '비밀번호를 입력해주세요.';
          }

          if (value.length < 6) {
            return '비밀번호는 최소 6자 이상이어야 합니다.';
          }

          return '';
        },
      },
      onSubmit: async (values) => {
        setSubmitError('');

        try {
          const result = await signIn(values);

          localStorage.setItem('accessToken', result.accessToken);
          localStorage.setItem('refreshToken', result.refreshToken);
          localStorage.setItem(
            'currentUser',
            JSON.stringify({ id: result.id, name: result.name }),
          );

          navigate('/', { replace: true });
        } catch (error) {
          setSubmitError(
            error instanceof Error
              ? error.message
              : '로그인에 실패했습니다. 다시 시도해주세요.',
          );
        }
      },
    });

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
            영화 취향을
            <br />
            다시 이어서
            <br />
            만나보세요.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            커스텀 `useForm` 훅으로 입력 상태와 유효성 검사를 관리하고,
            서버 로그인까지 안정적으로 연결한 화면입니다.
          </p>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-7 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur xl:p-9">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.36em] text-slate-400">
              Login
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
              계정에 로그인
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              이메일과 비밀번호를 입력하고 로그인 버튼을 눌러주세요.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
                  touched.email && errors.email
                    ? 'border-rose-400 focus:border-rose-400'
                    : 'border-white/10 focus:border-amber-300'
                }`}
                aria-invalid={Boolean(touched.email && errors.email)}
                {...register({ name: 'email' })}
              />
              {touched.email && errors.email ? (
                <p className="mt-2 text-sm text-rose-300">{errors.email}</p>
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
                placeholder="최소 6자 이상 입력해주세요"
                className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 ${
                  touched.password && errors.password
                    ? 'border-rose-400 focus:border-rose-400'
                    : 'border-white/10 focus:border-amber-300'
                }`}
                aria-invalid={Boolean(touched.password && errors.password)}
                {...register({ name: 'password' })}
              />
              {touched.password && errors.password ? (
                <p className="mt-2 text-sm text-rose-300">{errors.password}</p>
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
            <Link to="/" className="font-semibold text-amber-300">
              홈으로 돌아가기
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
