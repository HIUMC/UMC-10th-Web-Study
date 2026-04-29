import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { validateSignin, type UserSigninInformation } from "../utils/validate";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps, validateAll } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    if (!validateAll()) return;

    await login(values);
  };

  const handleGoogleLogin = () => {
    const serverUrl =
      import.meta.env.VITE_SERVER_API_URL ?? "http://localhost:8000";
    window.location.href = `${serverUrl}/v1/auth/google/login`;
  };

  const isDisabled: boolean =
    Object.values(errors).some((error: string) => error.length > 0) ||
    Object.values(values).some((value: string) => value === "");

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex flex-col gap-3">
        <div className="relative flex items-center px-4 py-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-xl font-semibold text-gray-700 shadow-sm transition-all hover:-translate-x-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            {"<"}
          </button>

          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
            로그인
          </h1>
        </div>

        <input
          {...getInputProps("email")}
          name="email"
          className={`w-[300px] rounded-sm border border-[#ccc] p-[10px] focus:border-[#807bff] ${
            errors?.email && touched?.email
              ? "border-red-500 bg-red-200"
              : "border-gray-300"
          }`}
          type="email"
          placeholder="이메일"
        />
        {errors?.email && touched?.email && (
          <div className="text-sm text-red-500">{errors.email}</div>
        )}

        <input
          {...getInputProps("password")}
          name="password"
          className={`w-[300px] rounded-sm border border-[#ccc] p-[10px] focus:border-[#807bff] ${
            errors?.password && touched?.password
              ? "border-red-500 bg-red-200"
              : "border-gray-300"
          }`}
          type="password"
          placeholder="비밀번호"
        />
        {errors?.password && touched?.password && (
          <div className="text-sm text-red-500">{errors.password}</div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="mt-1 h-12 w-full rounded-lg bg-blue-600 text-base font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
        >
          로그인
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white text-base font-semibold text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md active:translate-y-0"
        >
          <FcGoogle className="text-2xl" />
          <span>Google로 로그인</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
