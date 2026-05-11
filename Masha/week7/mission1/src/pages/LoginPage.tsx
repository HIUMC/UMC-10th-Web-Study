import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const redirectPath = searchParams.get("redirect") || "/";

  const handleGoogleLogin = () => {
    sessionStorage.setItem("redirectAfterLogin", redirectPath);
    window.location.href = "http://localhost:8000/v1/auth/google/login";
  };

  const handleNormalLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsPending(true);

      const response = await axios.post("http://localhost:8000/v1/auth/signin", {
        email,
        password,
      });

      console.log("로그인 응답:", response.data);

      const responseData = response.data;

      const accessToken =
        responseData?.data?.accessToken ||
        responseData?.data?.tokens?.accessToken ||
        responseData?.data?.access_token ||
        responseData?.accessToken ||
        responseData?.access_token;

      const user =
        responseData?.data?.user ||
        responseData?.data ||
        responseData?.user;

      if (!accessToken) {
        console.error("accessToken을 찾지 못했습니다.", responseData);
        alert("로그인 응답에서 accessToken을 찾지 못했습니다.");
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem(
        "nickname",
        user?.name || user?.nickname || "사용자"
      );
      localStorage.setItem(
        "userId",
        String(user?.id || user?.userId || "")
      );

      console.log("저장된 accessToken:", localStorage.getItem("accessToken"));

      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("로그인 실패:", error);

      if (axios.isAxiosError(error)) {
        console.error("상태 코드:", error.response?.status);
        console.error("응답 데이터:", error.response?.data);

        alert(error.response?.data?.message || "로그인에 실패했습니다.");
        return;
      }

      alert("로그인에 실패했습니다.");
    } finally {
      setIsPending(false);
    }
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요!"
            className="h-16 w-full rounded-lg border border-white/40 bg-[#1c1c1c] px-5 text-lg outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            disabled={isPending}
            className="h-16 w-full rounded-lg bg-pink-500 text-lg font-bold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;