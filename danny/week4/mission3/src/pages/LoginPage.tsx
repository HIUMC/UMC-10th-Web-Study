import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import { useForm } from "../hooks/useForm";
import { postSignin } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    try {
      const response = await postSignin(values);
      setItem(response.data.accessToken);
      console.log(response);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message ?? "로그인에 실패했습니다.");
        return;
      }

      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <main className="min-h-[calc(100dvh-72px)] bg-black px-6">
      <div className="mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-screen-xl items-center justify-center">
        <div className="w-full max-w-[360px]">
          <div className="relative mb-10 flex items-center justify-center">
            <Link
              to="/"
              className="absolute left-0 flex h-8 w-8 items-center justify-center text-[32px] leading-none text-white transition-opacity hover:opacity-70"
            >
              ‹
            </Link>

            <h1 className="text-[20px] font-bold text-white">로그인</h1>
          </div>

          <div className="flex flex-col gap-5">
            <button
              type="button"
              className="flex h-[44px] w-full items-center justify-center gap-3 rounded-md border border-white/70 bg-transparent text-[15px] font-medium text-white transition-colors hover:bg-white/5"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-5 w-5"
              />
              <span>구글 로그인</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/60" />
              <span className="text-[14px] font-semibold text-white">OR</span>
              <div className="h-px flex-1 bg-white/60" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <input
                  {...getInputProps("email")}
                  type="email"
                  placeholder="이메일을 입력해주세요!"
                  className={`h-[44px] w-full rounded-md border bg-[#171717] px-4 text-[14px] text-white placeholder:text-zinc-500 transition-colors focus:outline-none ${
                    errors?.email && touched?.email
                      ? "border-red-500/70"
                      : "border-white/60 focus:border-white"
                  }`}
                />
                {errors?.email && touched?.email && (
                  <p className="text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <input
                  {...getInputProps("password")}
                  type="password"
                  placeholder="비밀번호를 입력해주세요!"
                  className={`h-[44px] w-full rounded-md border bg-[#171717] px-4 text-[14px] text-white placeholder:text-zinc-500 transition-colors focus:outline-none ${
                    errors?.password && touched?.password
                      ? "border-red-500/70"
                      : "border-white/60 focus:border-white"
                  }`}
                />
                {errors?.password && touched?.password && (
                  <p className="text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isDisabled}
                className="mt-2 h-[44px] w-full rounded-md bg-zinc-900 text-[14px] font-medium text-zinc-300 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-600"
              >
                로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
