import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";

const schema = z
  .object({
    email: z.email({ message: "올바른 이메일 형식을 입력해주세요." }),
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
type SignupStep = "email" | "password" | "profile";

const EyeOpenIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 12C3.8 8.9 7.4 6.5 12 6.5C16.6 6.5 20.2 8.9 22 12C20.2 15.1 16.6 17.5 12 17.5C7.4 17.5 3.8 15.1 2 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
};

const EyeClosedIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M10.6 6.7C11.05 6.57 11.52 6.5 12 6.5C16.6 6.5 20.2 8.9 22 12C21.17 13.43 20.02 14.66 18.63 15.58"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M14.82 14.91C14.06 15.53 13.08 15.9 12 15.9C9.57 15.9 7.6 13.93 7.6 11.5C7.6 10.42 7.97 9.44 8.59 8.68"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M6.08 6.1C4.45 7.11 3.08 8.43 2 10.3C2.57 11.28 3.22 12.16 3.96 12.94"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M12 9.1C13.33 9.1 14.4 10.17 14.4 11.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

const MailIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[16px] w-[16px]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75Zm1.96-.25L12 11.26l7.04-4.76H4.96Zm14.54 1.81-6.94 4.69a1 1 0 0 1-1.12 0L4.5 8.31v8.94c0 .14.11.25.25.25h14.5a.25.25 0 0 0 .25-.25V8.31Z" />
    </svg>
  );
};

const GoogleIcon = () => {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-[18px] w-[18px]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5Z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.4-8l-6.5 5C9.5 39.6 16.2 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.2 5.2-6.1 6.7l.1-.1 6.2 5.2C35 40.2 44 34 44 24c0-1.3-.1-2.3-.4-3.5Z"
      />
    </svg>
  );
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignupStep>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const values = watch();

  const isEmailStepValid = values.email.trim() !== "" && !errors.email;

  const isPasswordStepValid =
    values.password.trim() !== "" &&
    values.passwordCheck.trim() !== "" &&
    !errors.password &&
    !errors.passwordCheck;

  const isProfileStepValid = values.name.trim() !== "" && !errors.name;

  const inputClassName = (hasError: boolean) =>
    `h-[44px] w-full rounded-md border bg-[#171717] px-4 text-[14px] text-white placeholder:text-zinc-500 transition-colors focus:outline-none ${
      hasError ? "border-red-500/70" : "border-white/60 focus:border-white"
    }`;

  const buttonClassName =
    "mt-2 h-[44px] w-full rounded-md bg-zinc-900 text-[14px] font-medium text-zinc-300 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-600 enabled:bg-zinc-900 enabled:text-zinc-300 enabled:hover:bg-zinc-800";

  const handleEmailNext = async () => {
    const isValid = await trigger("email");
    if (isValid) {
      setStep("password");
    }
  };

  const handlePasswordNext = async () => {
    const isValid = await trigger(["password", "passwordCheck"]);
    if (isValid) {
      setStep("profile");
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      setSubmitError("");
      const { passwordCheck, ...rest } = data;
      await postSignup(rest);
      navigate("/");
    } catch (error) {
      console.error(error);
      setSubmitError("회원가입 처리 중 오류가 발생했습니다.");
    }
  };

  const renderPasswordField = (
    field: "password" | "passwordCheck",
    placeholder: string,
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    const hasError =
      field === "password"
        ? !!errors.password &&
          (touchedFields.password || values.password !== "")
        : !!errors.passwordCheck &&
          (touchedFields.passwordCheck || values.passwordCheck !== "");

    const errorMessage =
      field === "password"
        ? errors.password?.message
        : errors.passwordCheck?.message;

    return (
      <div className="flex flex-col gap-1.5">
        <div
          className={`flex h-[44px] w-full rounded-md border bg-[#171717] text-white transition-colors ${
            hasError
              ? "border-red-500/70"
              : "border-white/60 focus-within:border-white"
          }`}
        >
          <input
            {...register(field)}
            type={visible ? "text" : "password"}
            placeholder={placeholder}
            className="h-full flex-1 bg-transparent px-4 text-[14px] text-white placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="flex h-full w-11 items-center justify-center text-zinc-400 transition-opacity hover:opacity-70"
          >
            {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
        </div>

        {hasError && <p className="text-xs text-red-400">{errorMessage}</p>}
      </div>
    );
  };

  const renderEmailStep = () => {
    return (
      <>
        <button
          type="button"
          className="h-[44px] w-full rounded-md border border-white/60 bg-black text-[14px] font-medium text-white transition-colors hover:border-white"
        >
          <span className="flex items-center justify-center gap-3">
            <GoogleIcon />
            <span>구글 로그인</span>
          </span>
        </button>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-white/60" />
          <span className="text-[14px] font-medium text-white">OR</span>
          <div className="h-px flex-1 bg-white/60" />
        </div>

        <div className="flex flex-col gap-1.5">
          <input
            {...register("email")}
            type="email"
            placeholder="이메일을 입력해주세요!"
            className={inputClassName(
              !!errors.email && (touchedFields.email || values.email !== ""),
            )}
          />
          {errors.email && (touchedFields.email || values.email !== "") && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleEmailNext}
          disabled={!isEmailStepValid || isSubmitting}
          className={buttonClassName}
        >
          다음
        </button>
      </>
    );
  };

  const renderPasswordStep = () => {
    return (
      <>
        <div className="flex items-center gap-2 text-white">
          <MailIcon />
          <span className="text-[14px] font-medium">{values.email}</span>
        </div>

        {renderPasswordField(
          "password",
          "비밀번호를 입력해주세요!",
          showPassword,
          setShowPassword,
        )}

        {renderPasswordField(
          "passwordCheck",
          "비밀번호를 다시 한 번 입력해주세요!",
          showPasswordCheck,
          setShowPasswordCheck,
        )}

        <button
          type="button"
          onClick={handlePasswordNext}
          disabled={!isPasswordStepValid || isSubmitting}
          className={buttonClassName}
        >
          다음
        </button>
      </>
    );
  };

  const renderProfileStep = () => {
    return (
      <>
        <div className="flex items-center gap-2 text-white">
          <MailIcon />
          <span className="text-[14px] font-medium">{values.email}</span>
        </div>

        <div className="flex justify-center py-2">
          <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full bg-zinc-300">
            <svg
              viewBox="0 0 120 120"
              fill="none"
              className="h-[120px] w-[120px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="60" cy="36" r="22" fill="#E7E7E7" />
              <path
                d="M20 104C20 82.4 37.5 65 59 65H61C82.5 65 100 82.4 100 104V108H20V104Z"
                fill="#E7E7E7"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <input
            {...register("name")}
            type="text"
            placeholder="이름을 입력해주세요!"
            className={inputClassName(
              !!errors.name && (touchedFields.name || values.name !== ""),
            )}
          />
          {errors.name && (touchedFields.name || values.name !== "") && (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        {submitError && <p className="text-xs text-red-400">{submitError}</p>}

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={!isProfileStepValid || isSubmitting}
          className={buttonClassName}
        >
          {isSubmitting ? "처리 중..." : "회원가입 완료"}
        </button>
      </>
    );
  };

  return (
    <main className="min-h-[calc(100dvh-72px)] bg-black px-6">
      <div className="mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-screen-xl items-center justify-center">
        <div className="w-full max-w-[360px]">
          <div className="relative mb-10 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                if (step === "password") {
                  setStep("email");
                  return;
                }

                if (step === "profile") {
                  setStep("password");
                  return;
                }

                navigate(-1);
              }}
              className="absolute left-0 flex h-8 w-8 items-center justify-center text-[32px] leading-none text-white transition-opacity hover:opacity-70"
            >
              ‹
            </button>

            <h1 className="text-[20px] font-bold text-white">회원가입</h1>
          </div>

          <div className="flex flex-col gap-4">
            {step === "email" && renderEmailStep()}
            {step === "password" && renderPasswordStep()}
            {step === "profile" && renderProfileStep()}
          </div>

          {step === "email" && (
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                이미 계정이 있나요? 로그인
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SignupPage;
