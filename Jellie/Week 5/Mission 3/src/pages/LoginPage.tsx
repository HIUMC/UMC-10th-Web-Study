import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import googleLogo from "../assets/google-logo.png";;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { accessToken, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/my");
    }
  }, [accessToken, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await login({
      email,
      password,
    });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_SERVER_API_URL
    }/v1/auth/google/login`;
  };

  return (
    <section className="grid place-items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-blue-600 mb-2">
            Welcome back
          </p>
          <h1 className="text-3xl font-bold">로그인</h1>
          <p className="text-slate-500 text-sm mt-2">
            계정으로 로그인하거나 구글 로그인을 이용하세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="w-full border border-slate-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border border-slate-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition"
          >
            로그인
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full border border-slate-300 py-3 rounded-xl flex items-center justify-center gap-3 font-semibold hover:bg-slate-50 active:scale-[0.98] transition"
        >
          <img src={googleLogo} alt="구글 로고" className="w-5 h-5" />
          <span>구글로 로그인</span>
        </button>
      </div>
    </section>
  );
}