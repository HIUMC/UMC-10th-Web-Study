import { useEffect } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { useAuth } from "../context/authContextValue";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSinginInformation } from "../utils/validate";

const LoginPage = () => {
  const { login, accessToken, isLoginPending } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: Location } | null;
  const from = state?.from
    ? `${state.from.pathname}${state.from.search}${state.from.hash}`
    : "/";

  useEffect(() => {
    if (accessToken) {
      navigate(from, { replace: true });
    }
  }, [accessToken, from, navigate]);

  const { values, errors, touched, getInputProps } =
    useForm<UserSinginInformation>({
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
      import.meta.env.VITE_SERVER_URL + "/v1/auth/google/login";
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "") ||
    isLoginPending;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">
        <input
          {...getInputProps("email")}
          name="email"
          className={`border border-[#ccc] bg-gray-500 w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          type="email"
          placeholder="이메일"
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}
        <input
          {...getInputProps("password")}
          className={`border border-[#ccc] bg-gray-500 w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          type="password"
          placeholder="비밀번호"
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full bg-blue-600 text-white p-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
        >
          로그인
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
        >
          <div className="flex items-center justify-center gap-4">
            <img
              src="/google_image.png"
              alt="Google Login"
              className="w-6 h-6"
            />
            <span>Google로 로그인</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
