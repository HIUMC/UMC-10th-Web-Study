import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);

  const redirectPath = searchParams.get("redirect") || "/";

  const handleGoogleLogin = () => {
    sessionStorage.setItem("redirectAfterLogin", redirectPath);
    window.location.href = "http://localhost:8000/v1/auth/google/login";
  };

  const handleNormalLogin = () => {
    localStorage.setItem("accessToken", "test-token");
    localStorage.setItem("nickname", "최수민");

    navigate(redirectPath, { replace: true });
  };

  return (
    <section className="min-h-[calc(100dvh-6rem)] bg-black px-8 py-16 text-white">
      <div className="mx-auto w-full max-w-120">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 text-3xl text-white/70 hover:text-white"
        >
          ‹
        </button>

        <h1 className="mb-10 text-center text-5xl font-bold">로그인</h1>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mb-10 flex h-16 w-full items-center justify-center gap-4 rounded-lg border border-white/50 text-lg font-semibold hover:bg-white/10"
        >
          <span className="font-bold">
            <span className="text-blue-500">G</span>
            <span className="text-red-500">o</span>
            <span className="text-yellow-400">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
          </span>
          구글 로그인
        </button>

        <div className="mb-10 flex items-center gap-6">
          <div className="h-px flex-1 bg-white/60" />
          <span className="text-white/70">OR</span>
          <div className="h-px flex-1 bg-white/60" />
        </div>

        <form className="space-y-6">
          <input
            type="email"
            placeholder="이메일을 입력해주세요!"
            className="h-16 w-full rounded-lg border border-white/40 bg-[#1c1c1c] px-5 text-lg outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요!"
              className="h-16 w-full rounded-lg border border-white/40 bg-[#1c1c1c] px-5 pr-14 text-lg outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-white/60 hover:text-white"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleNormalLogin}
            className="h-16 w-full rounded-lg bg-pink-500 text-lg font-bold text-white hover:bg-pink-600"
          >
            로그인
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;