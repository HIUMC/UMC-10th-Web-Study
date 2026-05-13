import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateLogin = (values: { email: string; password: string }) => {
  const errors: Partial<Record<'email' | 'password', string>> = {};

  if (!values.email) {
    errors.email = '이메일을 입력해주세요!';
  } else if (!emailRegex.test(values.email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요. (예: example@email.com)';
  }

  if (!values.password) {
    errors.password = '비밀번호를 입력해주세요!';
  } else if (values.password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다.';
  }

  return errors;
};

const LoginPage = () => {
  const navigate = useNavigate();

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isValid } = useForm({
    initialValues: { email: '', password: '' },
    validate: validateLogin,
  });

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await fetch('http://localhost:8000/v1/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      if (!response.ok) throw new Error('로그인 실패');

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/mypage');
    } catch {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const emailError = touched.email && errors.email;
  const passwordError = touched.password && errors.password;

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <form onSubmit={handleSubmit(onSubmit)} className="w-87.5 flex flex-col gap-3">

        <div className="relative flex items-center mb-5">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="absolute left-0 bg-transparent border-none text-white text-2xl cursor-pointer"
          >
            &lt;
          </button>
          <h2 className="w-full text-center text-white text-lg font-semibold">로그인</h2>
        </div>

        <button
          type="button"
          onClick={() => window.location.href = 'http://localhost:8000/v1/auth/google/login'}
          className="flex items-center justify-center gap-3 p-3 rounded-lg border border-[#444] bg-white text-black font-semibold hover:opacity-85 transition-opacity"
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            alt="Google"
            className="w-5 h-5"
          />
          구글 로그인
        </button>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-[#333]" />
          <span className="text-[#666] text-xs">OR</span>
          <div className="flex-1 h-px bg-[#333]" />
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="이메일을 입력해주세요!"
            className={`p-4 rounded-lg border bg-[#1a1a1a] text-white text-base outline-none placeholder-[#555] transition-colors ${
              emailError ? 'border-[#FF2E7E]' : 'border-[#333] focus:border-[#888]'
            }`}
          />
          {emailError && <span className="text-[#FF2E7E] text-xs ml-1">{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="비밀번호를 입력해주세요!"
            className={`p-4 rounded-lg border bg-[#1a1a1a] text-white text-base outline-none placeholder-[#555] transition-colors ${
              passwordError ? 'border-[#FF2E7E]' : 'border-[#333] focus:border-[#888]'
            }`}
          />
          {passwordError && <span className="text-[#FF2E7E] text-xs ml-1">{errors.password}</span>}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`mt-2 p-4 rounded-lg border-none font-bold text-base transition-colors ${
            isValid ? 'bg-[#FF2E7E] text-white cursor-pointer' : 'bg-[#333] text-[#666] cursor-not-allowed'
          }`}
        >
          로그인
        </button>
      </form>
    </div>
  );
};

export default LoginPage;