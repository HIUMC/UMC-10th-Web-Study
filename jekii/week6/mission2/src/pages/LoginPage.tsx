import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

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
    Object.values(errors || {}).some((error) => error.length > 0) || // 오류가 있으면 true
    Object.values(values).some((value) => value === ""); // 입력값이 비어있으면 true

  return (
    <div className="min-h-screen text-slate-800 dark:text-white font-sans flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
      <div className="w-full max-w-[420px] bg-white/80 dark:bg-[#1e1e24]/80 backdrop-blur-md p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-10 border border-slate-200 dark:border-gray-800 relative mt-10 transition-all">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute text-xl text-slate-400 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          {"<"}
        </button>
        <h2 className="text-2xl font-bold text-center mb-8 text-slate-800 dark:text-white">
          로그인
        </h2>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <input
              {...getInputProps("email")}
              className={`w-full bg-slate-50 dark:bg-[#2a2b36] border ${
                errors?.email && touched?.email
                  ? "border-pink-500"
                  : "border-slate-200 dark:border-gray-700"
              } rounded-xl p-4 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors`}
              type="email"
              placeholder="이메일"
            />
            {errors?.email && touched?.email && (
              <div className="text-pink-500 text-sm ml-1 mt-1">
                {errors.email}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <input
              {...getInputProps("password")}
              className={`w-full bg-slate-50 dark:bg-[#2a2b36] border ${
                errors?.password && touched?.password
                  ? "border-pink-500"
                  : "border-slate-200 dark:border-gray-700"
              } rounded-xl p-4 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors`}
              type="password"
              placeholder="비밀번호"
            />
            {errors?.password && touched?.password && (
              <div className="text-pink-500 text-sm ml-1 mt-1">
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 mt-2 rounded-xl disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-[#333] dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
          >
            로그인
          </button>

          {/* 구분선 */}
          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-slate-200 dark:bg-gray-700 transition-colors"></div>
            <span className="text-sm text-slate-400 dark:text-gray-500 transition-colors">
              또는
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-gray-700 transition-colors"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-[#2a2b36] border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-[#32333f] text-slate-800 dark:text-white py-4 rounded-xl font-medium transition-colors cursor-pointer flex items-center justify-center gap-3 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-5 h-5"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            <span>구글로 시작하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
