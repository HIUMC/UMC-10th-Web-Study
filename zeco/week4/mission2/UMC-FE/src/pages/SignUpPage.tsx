import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-full text-white">
      <div className="w-[320px] flex flex-col gap-4">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-xl hover:text-gray-300"
          >
            &lt;
          </button>
          <h2 className="text-lg font-semibold">회원가입</h2>
        </div>
        <p className="text-gray-400 text-sm text-center">준비 중입니다.</p>
      </div>
    </div>
  );
}

export default SignUpPage;
