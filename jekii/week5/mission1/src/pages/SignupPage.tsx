import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { postSignup } from "../apis/auth";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(6, { message: "비밀번호는 6자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    passwordCheck: z
      .string()
      .min(6, { message: "비밀번호는 6자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: { name: "", email: "", password: "", passwordCheck: "" },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const handleNextStep = async (fieldsToValidate: (keyof FormFields)[]) => {
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((prev) => prev + 1);
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { passwordCheck, ...rest } = data;
    try {
      const response = await postSignup(rest);
      console.log("회원가입 성공:", response);
      alert("회원가입이 완료되었습니다!");
      navigate("/");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2a2a32] rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-900 rounded-full opacity-20 blur-3xl"></div>
      {/* 메인 폼 컨테이너 */}
      <div className="w-full max-w-[420px] bg-[#1e1e24]/80 backdrop-blur-md p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-10 border border-gray-800 relative mt-10">
        {/* 뒤로가기 버튼 */}
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="absolute text-xl text-gray-400 hover:text-white transition-colors"
          >
            {"<"}
          </button>
        )}

        <h2 className="text-2xl font-bold text-center mb-8">
          {step === 1 && "회원가입"}
          {step === 2 && "비밀번호 설정"}
          {step === 3 && "회원가입 완료!"}
        </h2>

        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => e.preventDefault()}
        >
          {step === 1 && (
            <div className="animate-fade-in flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <input
                  {...register("email")}
                  className={`w-full bg-[#2a2b36] border ${errors?.email ? "border-pink-500" : "border-gray-700"} rounded-xl p-4 text-white focus:outline-none focus:border-pink-500 transition-colors`}
                  type="email"
                  placeholder="LPLP@music.com"
                />
                {errors.email && (
                  <div className="text-pink-500 text-sm ml-1 mt-1">
                    {errors.email.message}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleNextStep(["email"])}
                disabled={!!errors.email || !watch("email")}
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 mt-4 rounded-xl disabled:bg-[#333] disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
              >
                다음
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in flex flex-col gap-5">
              <div className="text-sm text-pink-400 text-center bg-pink-500/10 py-2 rounded-lg mb-2">
                {watch("email")}
              </div>

              <div className="flex flex-col gap-1.5 relative">
                <input
                  {...register("password")}
                  className={`w-full bg-[#2a2b36] border ${errors?.password ? "border-pink-500" : "border-gray-700"} rounded-xl p-4 pr-12 text-white focus:outline-none focus:border-pink-500 transition-colors`}
                  type={showPassword ? "text" : "password"}
                  placeholder="6자 이상 입력"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-white"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
                {errors.password && (
                  <div className="text-pink-500 text-sm ml-1 mt-1">
                    {errors.password.message}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5 relative">
                <input
                  {...register("passwordCheck")}
                  className={`w-full bg-[#2a2b36] border ${errors?.passwordCheck ? "border-pink-500" : "border-gray-700"} rounded-xl p-4 pr-12 text-white focus:outline-none focus:border-pink-500 transition-colors`}
                  type={showPasswordCheck ? "text" : "password"}
                  placeholder="비밀번호 재입력"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-white"
                >
                  {showPasswordCheck ? "🙈" : "👁️"}
                </button>
                {errors.passwordCheck && (
                  <div className="text-pink-500 text-sm ml-1 mt-1">
                    {errors.passwordCheck.message}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleNextStep(["password", "passwordCheck"])}
                disabled={
                  !!errors.password ||
                  !!errors.passwordCheck ||
                  !watch("password") ||
                  !watch("passwordCheck")
                }
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 mt-2 rounded-xl disabled:bg-[#333] disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
              >
                다음
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in flex flex-col gap-6">
              <div className="flex justify-center my-4">
                <div className="w-32 h-32 rounded-full border-[6px] border-[#2a2b36] bg-[#111] flex items-center justify-center relative shadow-[0_0_20px_rgba(0,0,0,0.8)] cursor-pointer group hover:border-pink-500 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gray-800 absolute flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-black"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <input
                  {...register("name")}
                  className={`w-full bg-[#2a2b36] border ${errors?.name ? "border-pink-500" : "border-gray-700"} rounded-xl p-4 text-white focus:outline-none focus:border-pink-500 transition-colors`}
                  type="text"
                  placeholder="닉네임123"
                />
                {errors.name && (
                  <div className="text-pink-500 text-sm ml-1 mt-1">
                    {errors.name.message}
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={isSubmitting || !!errors.name || !watch("name")}
                onClick={handleSubmit(onSubmit)}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold py-4 mt-2 rounded-xl shadow-[0_4px_15px_rgba(236,72,153,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
              >
                회원가입 완료
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
