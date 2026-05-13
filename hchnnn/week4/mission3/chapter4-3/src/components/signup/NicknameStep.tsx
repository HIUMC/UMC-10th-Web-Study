import { useFormContext } from 'react-hook-form';

export default function NicknameStep({ onPrev }: { onPrev: () => void }) {
  const { register, formState: { errors, isValid } } = useFormContext();

  return (
    <div className="flex flex-col gap-6 text-white items-center">
      <div className="w-full flex items-center gap-2">
        <button type="button" onClick={onPrev} className="text-xl">&lt;</button>
        <h2 className="flex-1 text-center font-bold text-lg">회원가입</h2>
      </div>

      {/* 프로필 이미지 UI (선택 미션) */}
      <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
        <img 
          src="https://via.placeholder.com/150" 
          alt="Profile Preview" 
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <div className="w-full flex flex-col gap-2">
        <input 
          {...register('nickname')}
          placeholder="닉네임을 입력해주세요!"
          className={`w-full p-3 rounded bg-[#1a1a1a] border ${errors.nickname ? 'border-red-500' : 'border-gray-700'} outline-none focus:border-pink-500`}
        />
        {errors.nickname && <p className="text-red-500 text-xs">{errors.nickname.message as string}</p>}
      </div>

      <button 
        type="submit" // 마지막 단계이므로 submit
        disabled={!isValid}
        className="w-full py-4 bg-pink-500 text-white rounded-lg font-bold disabled:bg-gray-800 transition-all active:scale-95"
      >
        회원가입 완료
      </button>
    </div>
  );
}