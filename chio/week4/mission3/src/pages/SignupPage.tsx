import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { negative, z } from "zod";
import { postSignup } from "../apis/auth";

type SignupStep = "email" | "password" | "name";
type FormFields = z.infer<typeof schema>;

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
      }),
    passwordCheck: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
      }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

const SignupPage = () => {
  const [step, setStep] = useState<SignupStep>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const navigate = useNavigate();
  const handleEmailNext = async () => {
    const isValid = await trigger("email");
    if (!isValid) return;

    setStep("password");
  };
  const handlePasswordNext = async () => {
    const isValid = await trigger(["password", "passwordCheck"]);
    if (!isValid) return;

    setStep("name");
  };

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const email = watch("email");

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { passwordCheck, ...rest } = data;
    const response = await postSignup(rest);
    navigate("/");
    console.log(response);
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
          <h1 className="text-center text-3xl font-bold">회원 가입</h1>
        </div>

        <div className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit(() => {})}>
            {step === "email" && (
              <>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="이메일을 입력해주세요!"
                  className="h-12 w-full rounded-md border border-white/60 bg-[#1d1d1d] px-3 text-sm text-white outline-none placeholder:text-white/55 focus:border-white"
                />
                {errors.email && (
                  <div className="text-red-500 text-sm">
                    {errors.email.message}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleEmailNext}
                  disabled={!!errors.email || isSubmitting}
                  className="mt-2 h-12 w-full rounded-md bg-[#1d1d1d] text-sm font-medium text-white/40 disabled:bg-gray-300 disabled:text-black/40"
                >
                  다음
                </button>
              </>
            )}

            {step === "password" && (
              <>
                <p className="text-sm text-white/65">{email}</p>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력해주세요!"
                    className="h-12 w-full rounded-md border border-white/60 bg-[#1d1d1d] px-3 pr-16 text-sm text-white outline-none placeholder:text-white/55 focus:border-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    {showPassword ? "숨기기" : "보기"}
                  </button>
                </div>
                {errors.password && (
                  <div className="text-red-500 text-sm">
                    {errors.password.message}
                  </div>
                )}
                <div className="relative">
                  <input
                    {...register("passwordCheck")}
                    type={showPasswordCheck ? "text" : "password"}
                    placeholder="비밀번호 재확인"
                    className="h-12 w-full rounded-md border border-white/60 bg-[#1d1d1d] px-3 pr-16 text-sm text-white outline-none placeholder:text-white/55 focus:border-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordCheck((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    {showPasswordCheck ? "숨기기" : "보기"}
                  </button>
                </div>
                {errors.passwordCheck && (
                  <div className="text-red-500 text-sm">
                    {errors.passwordCheck.message}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handlePasswordNext}
                  disabled={
                    !!errors.password || !!errors.passwordCheck || isSubmitting
                  }
                  className="mt-2 h-12 w-full rounded-md bg-[#1d1d1d] text-sm font-medium text-white/40 disabled:bg-gray-300 disabled:text-black/40"
                >
                  다음
                </button>
              </>
            )}

            {step === "name" && (
              <>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="이름을 입력해주세요!"
                  className="h-12 w-full rounded-md border border-white/60 bg-[#1d1d1d] px-3 text-sm text-white outline-none placeholder:text-white/55 focus:border-white"
                />
                {errors.name && (
                  <div className="text-red-500 text-sm">
                    {errors.name.message}
                  </div>
                )}
                <button
                  type="button"
                  disabled={!!errors.name || isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                  className="mt-2 h-12 w-full rounded-md bg-[#1d1d1d] text-sm font-medium text-white/40 disabled:bg-gray-300 disabled:text-black/40"
                >
                  회원가입 완료
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
