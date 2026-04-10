import { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';

// 1. 유효성 검사 스키마 (Zod)
const signupSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
  password: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
  passwordCheck: z.string(),
  nickname: z.string().min(2, { message: "닉네임은 2자 이상이어야 합니다." }),
}).refine((data) => data.password === data.passwordCheck, {
  path: ["passwordCheck"],
  message: "비밀번호가 일치하지 않습니다.",
});

type SignupFormValues = z.infer<typeof signupSchema>;

// 2. 1단계: 이메일 입력 컴포넌트
function EmailStep({ onNext }: { onNext: () => void }) {
  const { register, formState: { errors }, watch } = useFormContext();
  const emailValue = watch('email');

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-white text-center text-xl font-bold mb-4">회원가입</h2>
      <button type="button" className="w-full py-3 border border-gray-600 rounded text-white flex justify-center items-center gap-2 bg-[#1a1a1a]">
         <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="" />
         구글 로그인
      </button>
      <div className="flex items-center gap-2 my-2 text-gray-500 italic">
        <hr className="flex-1 border-gray-800"/><span className="text-xs">OR</span><hr className="flex-1 border-gray-800"/>
      </div>
      <div className="flex flex-col gap-1">
        <input 
          {...register('email')}
          placeholder="이메일을 입력해주세요!"
          className={`w-full p-3 rounded bg-[#1a1a1a] border ${errors.email ? 'border-red-500 bg-red-950/20' : 'border-gray-700'} text-white outline-none focus:border-pink-500`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
      </div>
      <button 
        type="button"
        disabled={!emailValue || !!errors.email}
        onClick={onNext}
        className="w-full py-3 bg-pink-500 text-white rounded font-bold disabled:bg-gray-800 disabled:text-gray-500 mt-2"
      >
        다음
      </button>
    </div>
  );
}

// 3. 2단계: 비밀번호 설정 컴포넌트
function PasswordStep({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const { register, watch, formState: { errors } } = useFormContext();
  const [showPw, setShowPw] = useState(false);
  const [showPwCheck, setShowPwCheck] = useState(false);
  
  const email = watch('email');
  const pw = watch('password');
  const pwCheck = watch('passwordCheck');
  const canGoNext = pw && pwCheck && !errors.password && !errors.passwordCheck;

  return (
    <div className="flex flex-col gap-4 text-white">
      <div className="flex items-center gap-2 mb-4">
        <button type="button" onClick={onPrev} className="p-2">&lt;</button>
        <h2 className="flex-1 text-center font-bold">회원가입</h2>
      </div>
      <p className="text-sm text-gray-300 ml-1 mb-2">📧 {email}</p>
      <div className="flex flex-col gap-1 relative">
        <input 
          type={showPw ? 'text' : 'password'}
          {...register('password')}
          placeholder="비밀번호를 입력해주세요!"
          className="w-full p-3 rounded bg-[#1a1a1a] border border-gray-700 outline-none focus:border-pink-500"
        />
        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-xs text-gray-500">
          {showPw ? '👁️' : '👁️‍🗨️'}
        </button>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
      </div>
      <div className="flex flex-col gap-1 relative">
        <input 
          type={showPwCheck ? 'text' : 'password'}
          {...register('passwordCheck')}
          placeholder="비밀번호를 다시 한 번 입력해주세요!"
          className="w-full p-3 rounded bg-[#1a1a1a] border border-gray-700 outline-none focus:border-pink-500"
        />
        <button type="button" onClick={() => setShowPwCheck(!showPwCheck)} className="absolute right-3 top-3.5 text-xs text-gray-500">
          {showPwCheck ? '👁️' : '👁️‍🗨️'}
        </button>
        {errors.passwordCheck && <p className="text-red-500 text-xs mt-1">{errors.passwordCheck.message as string}</p>}
      </div>
      <button 
        type="button"
        disabled={!canGoNext}
        onClick={onNext}
        className="w-full py-3 bg-pink-500 text-white rounded font-bold disabled:bg-gray-800 disabled:text-gray-500 mt-2"
      >
        다음
      </button>
    </div>
  );
}

// 4. 3단계: 닉네임 설정 컴포넌트
function NicknameStep({ onPrev }: { onPrev: () => void }) {
  const { register, formState: { errors, isValid } } = useFormContext();

  return (
    <div className="flex flex-col gap-6 text-white items-center">
      <div className="w-full flex items-center gap-2">
        <button type="button" onClick={onPrev} className="p-2">&lt;</button>
        <h2 className="flex-1 text-center font-bold">회원가입</h2>
      </div>
      <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border border-gray-700">
        <img src="https://via.placeholder.com/150" alt="" className="w-full h-full object-cover opacity-30" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <input 
          {...register('nickname')}
          placeholder="닉네임을 입력해주세요!"
          className={`w-full p-3 rounded bg-[#1a1a1a] border ${errors.nickname ? 'border-red-500' : 'border-gray-700'} outline-none focus:border-pink-500`}
        />
        {errors.nickname && <p className="text-red-500 text-xs mt-1">{errors.nickname.message as string}</p>}
      </div>
      <button 
        type="submit"
        disabled={!isValid}
        className="w-full py-4 bg-pink-500 text-white rounded-lg font-bold disabled:bg-gray-800 disabled:text-gray-500 transition-all active:scale-95"
      >
        회원가입 완료
      </button>
    </div>
  );
}

// 5. 메인 페이지 컴포넌트
export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const methods = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '', passwordCheck: '', nickname: '' }
  });

  const onSubmit = (data: SignupFormValues) => {
    localStorage.setItem('user_info', JSON.stringify({ email: data.email, nickname: data.nickname }));
    alert('회원가입이 완료되었습니다!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {step === 1 && <EmailStep onNext={() => setStep(2)} />}
            {step === 2 && <PasswordStep onNext={() => setStep(3)} onPrev={() => setStep(1)} />}
            {step === 3 && <NicknameStep onPrev={() => setStep(2)} />}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}