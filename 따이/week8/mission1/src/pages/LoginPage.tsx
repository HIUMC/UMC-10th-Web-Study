import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSinginInformation } from "../utils/validate";

const LoginPage = () => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    if (accessToken) {
      navigate(from, { replace: true });
    }
  }, [accessToken, navigate, from]);

  const { values, errors, touched, getInputProps } =
    useForm<UserSinginInformation>({
      initialValue: { email: "", password: "" },
      validate: validateSignin,
    });

  const { mutate, isPending } = useMutation({
    mutationFn: () => login(values),
    onSuccess: () => navigate(from, { replace: true }),
    onError: () => alert("로그인에 실패했습니다. 다시 시도해주세요."),
  });

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_URL + "/v1/auth/google/login";
  };

  const isDisabled =
    isPending ||
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

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
          onClick={() => mutate()}
          disabled={isDisabled}
          className="w-full bg-blue-600 text-white p-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
        >
          {isPending ? "로그인 중..." : "로그인"}
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-center gap-4">
            <img src="/google_image.png" alt="Google Login" className="w-6 h-6" />
            <span>Google로 로그인</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
