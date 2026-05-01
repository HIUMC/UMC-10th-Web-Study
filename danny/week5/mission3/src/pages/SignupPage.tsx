import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";
import GoogleIcon from "../icons/GoogleIcon";
import MailIcon from "../icons/MailIcon";
import EyeClosedIcon from "../icons/EyeClosedIcon";
import EyeOpenIcon from "../icons/EyeOpenIcon";

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
