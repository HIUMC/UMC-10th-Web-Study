import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { type UserSigninInformation, validateSignin } from "../utills/validate";
import { postSignin } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setItem } = useLocalStorage("accessToken");

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    console.log(values);
    try {
      const res = await postSignin(values);
      setItem(res.data.accessToken);
      console.log(res);
    } catch (error) {
      alert(error?.message);
    }
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <section className="flex min-h-[calc(100dvh-4rem)] items-start justify-center bg-black px-6 py-20 text-white">
      <div className="w-full max-w-xs">
        <div className="relative mb-8">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) navigate(-1);
              else navigate("/");
            }}
            aria-label="뒤로가기"
            className="absolute top-1/2 left-0 -translate-y-1/2 text-3xl leading-none text-white/80 transition hover:text-white"
          >
            &#8249;
          </button>
          <h1 className="text-center text-3xl font-bold">로그인</h1>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-white/70 bg-transparent px-4 text-sm font-semibold text-white"
          >
            <span className="text-lg font-bold text-white">
              <span className="text-blue-500">G</span>
              <span className="text-red-500">o</span>
              <span className="text-yellow-400">o</span>
              <span className="text-blue-500">g</span>
              <span className="text-green-500">l</span>
              <span className="text-red-500">e</span>
            </span>
            구글 로그인
          </button>

          <div className="flex items-center gap-4 py-2 text-sm font-semibold text-white/80">
            <div className="h-px flex-1 bg-white/70" />
            <span>OR</span>
            <div className="h-px flex-1 bg-white/70" />
          </div>

          <form className="space-y-4">
            <input
              {...getInputProps("email")}
              name="email"
              type="email"
              placeholder="이메일을 입력해주세요!"
              className="h-12 w-full rounded-md border border-white/60 bg-[#1d1d1d] px-3 text-sm text-white outline-none placeholder:text-white/55 focus:border-white"
            />
            {errors?.email && touched?.email && (
              <div className="text-red-500 text-sm">{errors.email}</div>
            )}
            <input
              {...getInputProps("password")}
              type="password"
              placeholder="비밀번호를 입력해주세요!"
              className="h-12 w-full rounded-md border border-white/60 bg-[#1d1d1d] px-3 text-sm text-white outline-none placeholder:text-white/55 focus:border-white"
            />
            {errors?.password && touched?.password && (
              <div className="text-red-500 text-sm">{errors.password}</div>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isDisabled}
              className="mt-2 h-12 w-full rounded-md bg-[#1d1d1d] text-sm font-medium text-white/40 disabled:bg-gray-300 disabled:text-black/40"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
