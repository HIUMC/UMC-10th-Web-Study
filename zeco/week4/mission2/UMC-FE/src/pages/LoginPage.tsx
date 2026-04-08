import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import { validateSignIn } from '../utils/validator';

function LoginPage() {
  const navigate = useNavigate();
  const { values, errors, touched, getInputProps } = useForm({
    initialValues: { email: '', password: '' },
    validate: validateSignIn,
  });

  const isDisabled =
    Object.keys(errors).length > 0 || !values.email || !values.password;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('로그인 시도:', values);
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-[320px] flex flex-col gap-4">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-xl hover:text-gray-300"
          >
            &lt;
          </button>
          <h2 className="text-white text-lg font-semibold">로그인</h2>
        </div>

        {/* 구글 로그인 */}
        <button className="flex items-center justify-center gap-3 w-full py-3 border border-gray-600 rounded text-white hover:bg-gray-800 bg-[#1a1a1a]">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          구글 로그인
        </button>

        {/* OR 구분선 */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-600" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-600" />
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <input
              type="email"
              placeholder="이메일을 입력해주세요!"
              {...getInputProps('email')}
              className={`w-full px-4 py-3 rounded border text-white text-sm outline-none bg-[#1a1a1a] placeholder-gray-500
                ${touched.email && errors.email ? 'border-red-500 bg-red-950' : 'border-gray-600 focus:border-pink-500'}`}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요!"
              {...getInputProps('password')}
              className={`w-full px-4 py-3 rounded border text-white text-sm outline-none bg-[#1a1a1a] placeholder-gray-500
                ${touched.password && errors.password ? 'border-red-500 bg-red-950' : 'border-gray-600 focus:border-pink-500'}`}
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full py-3 rounded text-white text-sm font-medium
              bg-gray-700 hover:bg-gray-600
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
