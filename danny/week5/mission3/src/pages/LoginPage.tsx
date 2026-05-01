import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import GoogleIcon from "../icons/GoogleIcon";

const LoginPage = () => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [navigate, accessToken]);

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    await login(values);
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <main className="min-h-[calc(100dvh-72px)] bg-black px-6">
      <div className="mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-screen-xl items-center justify-center">
        <div className="w-full max-w-[360px]">
          <div className="relative mb-10 flex items-center justify-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute left-0 flex h-8 w-8 items-center justify-center text-[32px] leading-none text-white transition-opacity hover:opacity-70"
            >
              ‹
            </button>
            <h1 className="text-[20px] font-bold text-white">로그인</h1>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <input
                {...getInputProps("email")}
                className={`h-[44px] w-full rounded-md border bg-[#171717] px-4 text-[14px] text-white placeholder:text-zinc-500 transition-colors focus:outline-none ${
                  errors?.email && touched?.email
                    ? "border-red-500/70"
                    : "border-white/60 focus:border-white"
                }`}
                type="email"
                placeholder="이메일을 입력해주세요!"
              />
              {errors?.email && touched?.email && (
                <p className="text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <input
                {...getInputProps("password")}
                className={`h-[44px] w-full rounded-md border bg-[#171717] px-4 text-[14px] text-white placeholder:text-zinc-500 transition-colors focus:outline-none ${
                  errors?.password && touched?.password
                    ? "border-red-500/70"
                    : "border-white/60 focus:border-white"
                }`}
                type="password"
                placeholder="비밀번호를 입력해주세요!"
              />
              {errors?.password && touched?.password && (
                <p className="text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isDisabled}
              className="mt-2 h-[44px] w-full rounded-md bg-zinc-900 text-[14px] font-medium text-zinc-300 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-600 enabled:bg-zinc-900 enabled:text-zinc-300 enabled:hover:bg-zinc-800"
            >
              로그인
            </button>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/60" />
              <span className="text-[14px] font-medium text-white">OR</span>
              <div className="h-px flex-1 bg-white/60" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="h-[44px] w-full rounded-md border border-white/60 bg-black text-[14px] font-medium text-white transition-colors hover:border-white"
            >
              <span className="flex items-center justify-center gap-3">
                <GoogleIcon />
                <span>구글 로그인</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
