import { useFormContext } from 'react-hook-form';

export default function EmailStep({ onNext }: { onNext: () => void }) {
  const { register, formState: { errors, isValid }, watch } = useFormContext();
  const emailValue = watch('email');

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-white text-center text-xl font-bold mb-4">회원가입</h2>
      <button type="button" className="w-full py-3 border border-gray-600 rounded text-white flex justify-center items-center gap-2 bg-[#1a1a1a]">
         <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="google" />
         구글 로그인
      </button>
      <div className="flex items-center gap-2 my-2 text-gray-500 italic"><hr className="flex-1 border-gray-700"/>OR<hr className="flex-1 border-gray-700"/></div>
      
      <input 
        {...register('email')}
        placeholder="이메일을 입력해주세요!"
        className={`w-full p-3 rounded bg-[#1a1a1a] border ${errors.email ? 'border-red-500' : 'border-gray-700'} text-white outline-none focus:border-pink-500`}
      />
      {errors.email && <p className="text-red-500 text-xs">{errors.email.message as string}</p>}
      
      <button 
        type="button"
        disabled={!emailValue || !!errors.email}
        onClick={onNext}
        className="w-full py-3 bg-pink-500 text-white rounded font-bold disabled:bg-gray-700 disabled:text-gray-500"
      >
        다음
      </button>
    </div>
  );
}