import { useNavigate } from 'react-router-dom';
import useLoginForm from '../hooks/useLoginForm';

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    email,
    password,
    setEmail,
    setPassword,
    emailError,
    passwordError,
    isFormValid,
  } = useLoginForm();

  const handleSubmit = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    alert('로그인 성공');
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

        <form onSubmit={handleSubmit} className='space-y-4'>
          <button
            type='button'
            className='flex w-full items-center justify-center rounded-md border border-white/40 bg-transparent px-4 py-3 font-semibold text-white transition hover:bg-white/10'
          >
            구글 로그인
          </button>

          <div className='flex items-center gap-3'>
            <div className='h-px flex-1 bg-white/30'></div>
            <span className='text-sm text-white/70'>OR</span>
            <div className='h-px flex-1 bg-white/30'></div>
          </div>

          <div>
            <input
              type='text'
              value={email}
              onChange={function (event) {
                setEmail(event.target.value);
              }}
              placeholder='이메일을 입력해주세요!'
              className='w-full rounded-md border border-white/30 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-lime-300'
            />
            {emailError ? (
              <p className='mt-2 text-sm text-red-400'>{emailError}</p>
            ) : null}
          </div>

          <div>
            <input
              type='password'
              value={password}
              onChange={function (event) {
                setPassword(event.target.value);
              }}
              placeholder='비밀번호를 입력해주세요!'
              className='w-full rounded-md border border-white/30 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-lime-300'
            />
            {passwordError ? (
              <p className='mt-2 text-sm text-red-400'>{passwordError}</p>
            ) : null}
          </div>

          <button
            type='submit'
            disabled={!isFormValid}
            className={
              'w-full rounded-md px-4 py-3 font-semibold transition ' +
              (isFormValid
                ? 'bg-lime-400 text-white hover:bg-lime-300'
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