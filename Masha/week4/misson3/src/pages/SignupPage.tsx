import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupSchema, type SignupFields } from "../schemas/signupSchema";
import { useLocalStorage } from "../hooks/useLocalStorage";

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordCheckVisible, setIsPasswordCheckVisible] = useState(false);
  
  const [, setUser] = useLocalStorage<any>("user_info", null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<SignupFields>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const passwordCheckValue = watch("passwordCheck");
  const nicknameValue = watch("nickname");

  const handleNextStep = async () => {
    if (step === 1) {
      const isEmailValid = await trigger("email");
      if (isEmailValid) setStep(2);
    } else if (step === 2) {
      const isPasswordValid = await trigger(["password", "passwordCheck"]);
      const isMatching = passwordValue === passwordCheckValue;

      if (isPasswordValid && isMatching) {
        setStep(3);
      }
    }
  };

  const onSubmit = (data: SignupFields) => {
    if (data.password !== data.passwordCheck) {
      return;
    }
    const { password, passwordCheck, ...userInfo } = data;
    setUser(userInfo);
    alert(`${data.nickname}님, 회원가입을 축하합니다!`);
    navigate("/");
  };

  return (
    <section className="flex min-h-[calc(100dvh-4rem)] items-start justify-center bg-black px-6 py-20 text-white">
      <div className="w-full max-w-xs">
        <div className="relative mb-8 text-center">
          <button
            type="button"
            onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl text-white/80 hover:text-white"
          >
            &#8249;
          </button>
          <h1 className="text-2xl font-bold">회원가입</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <button type="button" className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-white/70 bg-transparent text-sm font-semibold">
                구글 로그인
              </button>
              <div className="flex items-center gap-4 py-2 text-sm font-semibold text-white/20">
                <div className="h-px flex-1 bg-white/20" />
                <span>OR</span>
                <div className="h-px flex-1 bg-white/20" />
              </div>
              <div className="space-y-2">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="이메일을 입력해주세요!"
                  className={`h-12 w-full rounded-md border bg-[#1d1d1d] px-3 text-sm outline-none transition ${
                    errors.email ? "border-red-500" : "border-white/60 focus:border-white"
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
              </div>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!emailValue || !!errors.email}
                className={`h-12 w-full rounded-md text-sm font-bold transition ${
                  !errors.email && emailValue ? "bg-[#FF4B91] text-white" : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                다음
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center gap-2 mb-2 text-sm text-white/70">
                <span className="text-xs">✉️</span> {emailValue}
              </div>
              
              <div className="relative space-y-2">
                <input
                  {...register("password")}
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요!"
                  className={`h-12 w-full rounded-md border bg-[#1d1d1d] px-3 pr-10 text-sm outline-none transition ${
                    errors.password ? "border-red-500" : "border-white/60 focus:border-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-3.5 text-xs text-white/50 hover:text-white"
                >
                  {isPasswordVisible ? "🙈" : "👁️"}
                </button>
                {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
              </div>

              <div className="relative space-y-2">
                <input
                  {...register("passwordCheck")}
                  type={isPasswordCheckVisible ? "text" : "password"}
                  placeholder="비밀번호를 다시 한 번 입력해주세요!"
                  className={`h-12 w-full rounded-md border bg-[#1d1d1d] px-3 pr-10 text-sm outline-none transition ${
                    (errors.passwordCheck || (passwordCheckValue && passwordValue !== passwordCheckValue)) 
                      ? "border-red-500" 
                      : "border-white/60 focus:border-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordCheckVisible(!isPasswordCheckVisible)}
                  className="absolute right-3 top-3.5 text-xs text-white/50 hover:text-white"
                >
                  {isPasswordCheckVisible ? "🙈" : "👁️"}
                </button>
                {(errors.passwordCheck || (passwordCheckValue && passwordValue !== passwordCheckValue)) && (
                  <p className="text-xs text-red-500 ml-1">
                    {errors.passwordCheck?.message || "비밀번호가 일치하지 않습니다."}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={
                  !passwordValue || 
                  !passwordCheckValue || 
                  !!errors.password || 
                  !!errors.passwordCheck || 
                  passwordValue !== passwordCheckValue
                }
                className={`h-12 w-full rounded-md text-sm font-bold transition ${
                  !errors.password && !errors.passwordCheck && passwordValue === passwordCheckValue && passwordValue !== ""
                    ? "bg-[#FF4B91] text-white"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                다음
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center gap-6 animate-fadeIn">
              <div className="relative w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center border-2 border-dashed border-gray-600">
                <span className="text-4xl text-gray-500">👤</span>
                <div className="absolute bottom-0 right-0 bg-pink-500 p-2 rounded-full text-xs">📸</div>
              </div>
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <input
                    {...register("nickname")}
                    placeholder="닉네임을 입력해주세요!"
                    className={`h-12 w-full rounded-md border bg-[#1d1d1d] px-3 text-sm outline-none transition ${
                      errors.nickname ? "border-red-500" : "border-white/60 focus:border-white"
                    }`}
                  />
                  {errors.nickname && <p className="text-xs text-red-500 ml-1">{errors.nickname.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={!nicknameValue || !!errors.nickname}
                  className={`h-12 w-full rounded-md text-sm font-bold transition ${
                    !errors.nickname && nicknameValue ? "bg-[#FF4B91] text-white shadow-lg shadow-pink-500/20" : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  회원가입 완료
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default SignupPage;