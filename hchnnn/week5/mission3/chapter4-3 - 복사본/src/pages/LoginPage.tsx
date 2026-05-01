import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
  password: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await axiosInstance.post('/auth/signin', {
        email: data.email,
        password: data.password,
      });

      const token = response.data.accessToken;
      setAccessToken(token);

      alert('로그인 성공!');
      navigate('/my');
    } catch (error: any) {
      alert(error.response?.data?.message || '로그인에 실패했습니다.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/v1/auth/google';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-8">
        <h2 className="text-white text-center text-2xl font-bold">로그인</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <input 
              {...register('email')}
              placeholder="이메일을 입력해주세요"
              className={`w-full p-3 rounded bg-[#1a1a1a] border ${errors.email ? 'border-red-500' : 'border-gray-700'} text-white outline-none focus:border-pink-500`}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <input 
              type="password"
              {...register('password')}
              placeholder="비밀번호를 입력해주세요"
              className={`w-full p-3 rounded bg-[#1a1a1a] border ${errors.password ? 'border-red-500' : 'border-gray-700'} text-white outline-none focus:border-pink-500`}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          <button 
            type="submit"
            disabled={!isValid}
            className="w-full py-4 bg-pink-500 text-white rounded-lg font-bold disabled:bg-gray-800 disabled:text-gray-500 transition-all active:scale-95"
          >
            로그인
          </button>
        </form>

        <div className="flex flex-col gap-4">
          <div className="relative flex items-center justify-center">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase">OR</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-4 bg-white text-black rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95 hover:bg-gray-200"
          >
            Google 계정으로 로그인
          </button>
        </div>

        <div className="text-center text-gray-500 text-sm">
          계정이 없으신가요?{" "}
          <span 
            onClick={() => navigate('/signup')} 
            className="text-pink-500 cursor-pointer hover:underline"
          >
            회원가입
          </span>
        </div>
      </div>
    </div>
  );
}