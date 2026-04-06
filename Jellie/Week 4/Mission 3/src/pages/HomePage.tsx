import googleLogo from '../assets/google-logo.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '../schemas/auth';
import useLocalStorage from '../hooks/useLocalStorage';

export default function LoginPage() {
  const navigate = useNavigate();
  const [, setStoredAuth] = useLocalStorage('auth', {
    email: '',
    token: '',
    isLoggedIn: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = function (data: LoginFormValues) {
    setStoredAuth({
      email: data.email,
      token: 'mock-login-token',
      isLoggedIn: true,
    });

    alert('로그인 성공');
    navigate('/');
  };

  return (
    <section className='flex min-h-[calc(100vh-73px)] items-center justify-center bg-black px-6'>
      <div className='w-full max-w-sm'>
        <button
          type='button'
          onClick={function () {
            navigate(-1);
          }}
          className='mb-6 text-xl text-white transition hover:text-lime-300'
        >
          {'<'}
        </button>

        <h1 className='mb-6 text-center text-2xl font-bold text-white'>로그인</h1>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <button
            type='button'
            className='flex w-full items-center justify-center gap-3 rounded-md border border-white/40 bg-white px-4 py-3 font-semibold text-black transition hover:bg-white/90'
          >
            <img src={googleLogo} alt='구글 로고' className='h-5 w-5 object-contain' />
            구글로 로그인
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

          <div>
            <input
              type='password'
              placeholder='비밀번호를 입력해주세요!'
              {...register('password')}
              className='w-full rounded-md border border-white/30 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-lime-300'
            />
            {errors.password ? (
              <p className='mt-2 text-sm text-red-400'>{errors.password.message}</p>
            ) : null}
          </div>

          <button
            type='submit'
            disabled={!isValid}
            className={
              'w-full rounded-md px-4 py-3 font-semibold transition ' +
              (isValid
                ? 'bg-lime-400 text-black hover:bg-lime-300'
                : 'cursor-not-allowed bg-white/10 text-white/40')
            }
          >
            로그인
          </button>
        </form>
      </div>
    </section>
  );
}