import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import googleLogo from "../assets/google-logo.png";
import { signIn } from "../apis/auth";
import { useAuth } from "../context/AuthContext";

type LocationState = {
  from?: {
    pathname: string;
  };
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const state = location.state as LocationState | null;
  const redirectPath = state?.from?.pathname || "/lps";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await signIn({
        email,
        password,
      });

      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      login(accessToken, refreshToken);

      navigate(redirectPath, {
        replace: true,
      });
    } catch (error) {
      console.error(error);
      alert("로그인에 실패했습니다.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  return (
    <main className="min-h-[calc(100vh-120px)] flex items-center justify-center">
      <section className="w-full max-w-md bg-[#18181d] rounded-3xl p-8">
        <h1 className="text-3xl font-black text-center mb-8">로그인</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="이메일"
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none focus:border-pink-500"
          />

          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="비밀번호"
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none focus:border-pink-500"
          />

          <button className="mt-2 py-3 rounded-xl bg-pink-500 font-bold">
            로그인
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full py-3 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-3"
        >
          <img src={googleLogo} alt="Google" className="w-5 h-5" />
          Google로 로그인
        </button>
      </section>
    </main>
  );
}