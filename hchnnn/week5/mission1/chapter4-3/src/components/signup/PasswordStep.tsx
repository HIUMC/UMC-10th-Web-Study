import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export default function PasswordStep({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
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
        <button type="button" onClick={onPrev}>&lt;</button>
        <h2 className="flex-1 text-center font-bold">회원가입</h2>
      </div>
      <p className="flex items-center gap-2 text-sm text-gray-300">📧 {email}</p>
      
      <div className="relative">
        <input 
          type={showPw ? 'text' : 'password'}
          {...register('password')}
          placeholder="비밀번호를 입력해주세요!"
          className="w-full p-3 rounded bg-[#1a1a1a] border border-gray-700 outline-none focus:border-pink-500"
        />
        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3 text-gray-500">
          {showPw ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
      {errors.password && <p className="text-red-500 text-xs">{errors.password.message as string}</p>}

      <div className="relative">
        <input 
          type={showPwCheck ? 'text' : 'password'}
          {...register('passwordCheck')}
          placeholder="비밀번호를 다시 한 번 입력해주세요!"
          className="w-full p-3 rounded bg-[#1a1a1a] border border-gray-700 outline-none focus:border-pink-500"
        />
        <button type="button" onClick={() => setShowPwCheck(!showPwCheck)} className="absolute right-3 top-3 text-gray-500">
          {showPwCheck ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
      {errors.passwordCheck && <p className="text-red-500 text-xs">{errors.passwordCheck.message as string}</p>}

      <button 
        type="button"
        disabled={!canGoNext}
        onClick={onNext}
        className="w-full py-3 bg-pink-500 text-white rounded font-bold disabled:bg-gray-800"
      >
        다음
      </button>
    </div>
  );
}