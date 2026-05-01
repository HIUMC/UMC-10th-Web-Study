// EmailStep.tsx 수정 제안
<button 
  type="button" 
  onClick={() => window.location.href = 'http://localhost:8000/v1/auth/google'}
  className="w-full py-3 border border-gray-600 rounded text-white flex justify-center items-center gap-2 bg-[#1a1a1a]"
>
   <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="google" />
   구글 로그인
</button>