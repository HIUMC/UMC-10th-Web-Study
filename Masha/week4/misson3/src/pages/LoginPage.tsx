import { useNavigate } from "react-router-dom";
import  useForm  from "../hooks/useForm";
import { validateLogin } from "../utils/validate";

interface UserSigninInformation {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValues: {
        email: "",
        password: "",
      },
      validate: validateLogin,
    });

const isDisabled =
  Object.keys(errors || {}).length > 0 || 
  Object.values(values).some((value) => value === "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDisabled) {
      console.log("로그인 시도 데이터:", values);
      // TODO: axios.post('http://localhost:3000/auth/signin', values) 호출 예정
    }
  };

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
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-white/70 bg-transparent px-4 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <span className="text-lg font-bold">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <input
                {...getInputProps("email")}
                type="email"
                placeholder="이메일을 입력해주세요!"
                className={`h-12 w-full rounded-md border bg-[#1d1d1d] px-3 text-sm text-white outline-none placeholder:text-white/55 transition ${
                  touched.email && errors.email ? "border-red-500" : "border-white/60 focus:border-white"
                }`}
              />
              {errors.email && touched.email && (
                <div className="text-xs text-red-500 ml-1">{errors.email}</div>
              )}
            </div>

            <div className="space-y-1">
              <input
                {...getInputProps("password")}
                type="password"
                placeholder="비밀번호를 입력해주세요!"
                className={`h-12 w-full rounded-md border bg-[#1d1d1d] px-3 text-sm text-white outline-none placeholder:text-white/55 transition ${
                  touched.password && errors.password ? "border-red-500" : "border-white/60 focus:border-white"
                }`}
              />
              {errors.password && touched.password && (
                <div className="text-xs text-red-500 ml-1">{errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isDisabled}
              className={`mt-2 h-12 w-full rounded-md text-sm font-bold transition-all ${
                isDisabled
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                  : "bg-[#FF4B91] text-white hover:bg-[#ff3380] shadow-lg shadow-pink-500/20"
              }`}
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