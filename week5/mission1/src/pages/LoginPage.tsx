import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { login } = useAuth();
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

  // 오류가 하나라도 있거나, 입력값이 비어있으면 버튼 비활성화
  const isDisabled: boolean =
    Object.values(errors).some((error: string) => error.length > 0) || // 오류가 있으면 true
    Object.values(values).some((value: string) => value === ""); // 입력값이 비어있으면 true

  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">

        <div className="relative flex items-center px-4 py-3">
          <button
            type="button"
            className="text-xl"
            onClick={() => navigate(-1)}
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
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${
            errors?.email && touched?.email
              ? "border-red-500 bg-red-200"
              : "border-gray-300"
          }`}
          type="email"
          placeholder="이메일"
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}

        <input
          {...getInputProps("password")}
          name="password"
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${
            errors?.password && touched?.password
              ? "border-red-500 bg-red-200"
              : "border-gray-300"
          }`}
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
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
