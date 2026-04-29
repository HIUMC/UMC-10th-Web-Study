import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
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

    const isLoggedIn = await login(values);
    if (isLoggedIn) {
      navigate("/my", { replace: true });
    }
  };

  const isDisabled =
    Object.values(errors).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value.trim() === "");

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <form
        className="flex w-[300px] flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <div className="relative flex items-center px-4 py-3">
          <button
            type="button"
            className="text-xl"
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
          className={`w-full rounded-sm border p-[10px] focus:border-[#807bff] ${
            errors?.email && touched?.email
              ? "border-red-500 bg-red-200"
              : "border-gray-300"
          }`}
          type="email"
          placeholder="이메일"
          autoComplete="email"
        />
        {errors?.email && touched?.email && (
          <div className="text-sm text-red-500">{errors.email}</div>
        )}

        <input
          {...getInputProps("password")}
          name="password"
          className={`w-full rounded-sm border p-[10px] focus:border-[#807bff] ${
            errors?.password && touched?.password
              ? "border-red-500 bg-red-200"
              : "border-gray-300"
          }`}
          type="password"
          placeholder="비밀번호"
          autoComplete="current-password"
        />
        {errors?.password && touched?.password && (
          <div className="text-sm text-red-500">{errors.password}</div>
        )}

        <button
          type="submit"
          disabled={isDisabled}
          className="w-full cursor-pointer rounded-md bg-blue-600 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300"
        >
          로그인
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
