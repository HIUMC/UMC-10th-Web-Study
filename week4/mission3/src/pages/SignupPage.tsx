import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { IoChevronBack, IoEye, IoEyeOff } from "react-icons/io5";
import { signupSchema, type SignupFormValues } from "../utils/schema";
import useLocalStorage from "../hooks/useLocalStorage"; // ✅ 추가

const SignupPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  // ✅ localStorage 훅
  const { setItem } = useLocalStorage("user", null);

  const {
    register,
    watch,
    trigger,
    formState: { errors, touchedFields },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordCheck: "",
      nickname: "",
    },
  });

  const email = watch("email");
  const password = watch("password");
  const passwordCheck = watch("passwordCheck");
  const nickname = watch("nickname");

  const isStep1Valid = email.trim() !== "" && !errors.email;

  const isStep2Valid =
    password.trim() !== "" &&
    passwordCheck.trim() !== "" &&
    !errors.password &&
    !errors.passwordCheck;

  const isStep3Valid = nickname.trim() !== "" && !errors.nickname;

  const handleBack = () => {
    if (step === 3) return setStep(2);
    if (step === 2) return setStep(1);
    navigate("/");
  };

  const handleNextFromEmail = async () => {
    const isValid = await trigger("email");
    if (isValid) setStep(2);
  };

  const handleNextFromPassword = async () => {
    const isValid = await trigger(["password", "passwordCheck"]);
    if (isValid) setStep(3);
  };

  // ✅ 핵심 수정 부분
  const handleCompleteSignup = async () => {
    const isValid = await trigger("nickname");

    if (isValid) {
      setItem({
        email,
        nickname,
      });

      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-xs">
          <div className="relative mb-8 flex items-center justify-center">
            <button
              onClick={handleBack}
              className="absolute left-0 text-2xl text-white hover:text-gray-300"
            >
              <IoChevronBack />
            </button>
            <h2 className="text-3xl font-bold">회원가입</h2>
          </div>

          {step === 1 && (
            <>
              <button className="relative mb-6 flex w-full items-center justify-center rounded border border-white/40 bg-black px-4 py-3 text-base font-medium text-white hover:bg-white/5">
                <FcGoogle className="absolute left-4 text-2xl" />
                구글 로그인
              </button>

              <div className="mb-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/40" />
                <span className="text-sm text-white">OR</span>
                <div className="h-px flex-1 bg-white/40" />
              </div>

              <input
                type="email"
                placeholder="이메일을 입력해주세요!"
                {...register("email")}
                className={`mb-2 w-full rounded border bg-zinc-900 px-4 py-3 text-white placeholder:text-gray-400 outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "border-white/40 focus:border-pink-500"
                }`}
              />

              {(touchedFields.email || email.trim() !== "") && errors.email && (
                <p className="mb-4 text-center text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}

              <button
                type="button"
                disabled={!isStep1Valid}
                onClick={handleNextFromEmail}
                className={`w-full rounded px-4 py-3 text-base font-medium ${
                  isStep1Valid
                    ? "bg-pink-500 text-white hover:bg-pink-400"
                    : "bg-zinc-900 text-gray-400"
                }`}
              >
                다음
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-4 flex items-center gap-2 rounded border border-white/20 bg-zinc-900 px-3 py-2 text-sm text-white">
                <span>✉</span>
                <span>{email}</span>
              </div>

              <div className="relative mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요!"
                  {...register("password")}
                  className={`w-full rounded border bg-zinc-900 px-4 py-3 pr-12 text-white placeholder:text-gray-400 outline-none ${
                    errors.password
                      ? "border-red-500"
                      : "border-white/40 focus:border-pink-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 hover:text-white"
                >
                  {showPassword ? <IoEye /> : <IoEyeOff />}
                </button>
              </div>

              {(touchedFields.password || password.trim() !== "") &&
                errors.password && (
                  <p className="mb-3 text-center text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}

              <div className="relative mb-2">
                <input
                  type={showPasswordCheck ? "text" : "password"}
                  placeholder="비밀번호를 다시 한 번 입력해주세요!"
                  {...register("passwordCheck")}
                  className={`w-full rounded border bg-zinc-900 px-4 py-3 pr-12 text-white placeholder:text-gray-400 outline-none ${
                    errors.passwordCheck
                      ? "border-red-500"
                      : "border-white/40 focus:border-pink-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordCheck((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 hover:text-white"
                >
                  {showPasswordCheck ? <IoEye /> : <IoEyeOff />}
                </button>
              </div>

              {(touchedFields.passwordCheck || passwordCheck.trim() !== "") &&
                errors.passwordCheck && (
                  <p className="mb-4 text-center text-sm text-red-500">
                    {errors.passwordCheck.message}
                  </p>
                )}

              <button
                type="button"
                disabled={!isStep2Valid}
                onClick={handleNextFromPassword}
                className={`w-full rounded px-4 py-3 text-base font-medium ${
                  isStep2Valid
                    ? "bg-pink-500 text-white hover:bg-pink-400"
                    : "bg-zinc-900 text-gray-400"
                }`}
              >
                다음
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-6 flex justify-center">
                <img
                  src="/profile.jpg"
                  alt="기본 프로필"
                  className="h-32 w-32 rounded-full object-cover"
                />
              </div>

              <input
                type="text"
                placeholder="닉네임을 입력해주세요!"
                {...register("nickname")}
                className={`mb-2 w-full rounded border bg-zinc-900 px-4 py-3 text-white placeholder:text-gray-400 outline-none ${
                  errors.nickname
                    ? "border-red-500"
                    : "border-white/40 focus:border-pink-500"
                }`}
              />

              {(touchedFields.nickname || nickname.trim() !== "") &&
                errors.nickname && (
                  <p className="mb-4 text-center text-sm text-red-500">
                    {errors.nickname.message}
                  </p>
                )}

              <button
                type="button"
                disabled={!isStep3Valid}
                onClick={handleCompleteSignup}
                className={`w-full rounded px-4 py-3 text-base font-medium ${
                  isStep3Valid
                    ? "bg-pink-500 text-white hover:bg-pink-400"
                    : "bg-zinc-900 text-gray-400"
                }`}
              >
                회원가입 완료
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;