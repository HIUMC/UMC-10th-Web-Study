import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useLocalStorage from "../hooks/useLocalStorage";

// ─── Schemas ───────────────────────────────────────────────────────────────────

const emailSchema = z.object({
  email: z.string().email("올바른 이메일 형식을 입력해주세요. (예: example@email.com)"),
});

const passwordSchema = z
  .object({
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

const nameSchema = z.object({
  name: z.string().min(1, "닉네임을 입력해주세요."),
});

type EmailForm    = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;
type NameForm     = z.infer<typeof nameSchema>;

// ─── Shared UI ─────────────────────────────────────────────────────────────────

const inputClass = (hasError: boolean) =>
  `w-full p-4 rounded-lg border bg-[#1a1a1a] text-white text-base outline-none placeholder-[#555] transition-colors ${
    hasError ? "border-[#FF2E7E]" : "border-[#333] focus:border-[#888]"
  }`;

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? <span className="text-[#FF2E7E] text-xs ml-1">{msg}</span> : null;

const SubmitBtn = ({ label, disabled }: { label: string; disabled: boolean }) => (
  <button
    type="submit"
    disabled={disabled}
    className={`mt-2 p-4 rounded-lg border-none font-bold text-base transition-colors ${
      disabled
        ? "bg-[#333] text-[#666] cursor-not-allowed"
        : "bg-[#FF2E7E] text-white cursor-pointer"
    }`}
  >
    {label}
  </button>
);

const EyeBtn = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] text-sm"
  >
    {show ? "🙈" : "👁️"}
  </button>
);

// ─── Page ──────────────────────────────────────────────────────────────────────

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep]         = useState(1);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword]             = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [, setToken] = useLocalStorage<string>("accessToken", "");

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  const nameForm = useForm<NameForm>({
    resolver: zodResolver(nameSchema),
    mode: "onChange",
  });

  const onEmailNext = (data: EmailForm) => {
    setEmail(data.email);
    setStep(2);
  };

  const onPasswordNext = (data: PasswordForm) => {
    setPassword(data.password);
    setStep(3);
  };

  const onSignupComplete = async (data: NameForm) => {
    try {
      const response = await fetch("http://localhost:8000/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: data.name }),
      });

      if (!response.ok) throw new Error("회원가입 실패");

      const result = await response.json();
      setToken(result.accessToken);
      navigate("/");
    } catch {
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="w-87.5 flex flex-col gap-3">

        {/* 헤더 */}
        <div className="relative flex items-center mb-5">
          <button
            type="button"
            onClick={() => (step === 1 ? navigate("/") : setStep(step - 1))}
            className="absolute left-0 bg-transparent border-none text-white text-2xl cursor-pointer"
          >
            &lt;
          </button>
          <h2 className="w-full text-center text-white text-lg font-semibold">
            회원가입
          </h2>
        </div>

        {/* Step 1: 이메일 */}
        {step === 1 && (
          <form onSubmit={emailForm.handleSubmit(onEmailNext)} className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => (window.location.href = "http://localhost:8000/v1/auth/google/login")}
              className="flex items-center justify-center gap-3 p-3 rounded-lg border border-[#444] bg-white text-black font-semibold hover:opacity-85 transition-opacity"
            >
              <img
                src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                alt="Google"
                className="w-5 h-5"
              />
              구글 로그인
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-[#333]" />
              <span className="text-[#666] text-xs">OR</span>
              <div className="flex-1 h-px bg-[#333]" />
            </div>

            <div className="flex flex-col gap-1">
              <input
                {...emailForm.register("email")}
                type="email"
                placeholder="이메일을 입력해주세요!"
                className={inputClass(!!emailForm.formState.errors.email)}
              />
              <ErrorMsg msg={emailForm.formState.errors.email?.message} />
            </div>

            <SubmitBtn label="다음" disabled={!emailForm.formState.isValid} />
          </form>
        )}

        {/* Step 2: 비밀번호 */}
        {step === 2 && (
          <form onSubmit={passwordForm.handleSubmit(onPasswordNext)} className="flex flex-col gap-3">
            <p className="text-[#888] text-sm">{email}</p>
            <p className="text-white font-semibold">비밀번호를 설정해주세요</p>

            <div className="flex flex-col gap-1">
              <div className="relative">
                <input
                  {...passwordForm.register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요!"
                  className={inputClass(!!passwordForm.formState.errors.password)}
                />
                <EyeBtn show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
              </div>
              <ErrorMsg msg={passwordForm.formState.errors.password?.message} />
            </div>

            <div className="flex flex-col gap-1">
              <div className="relative">
                <input
                  {...passwordForm.register("passwordConfirm")}
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력해주세요!"
                  className={inputClass(!!passwordForm.formState.errors.passwordConfirm)}
                />
                <EyeBtn show={showPasswordConfirm} onToggle={() => setShowPasswordConfirm((v) => !v)} />
              </div>
              <ErrorMsg msg={passwordForm.formState.errors.passwordConfirm?.message} />
            </div>

            <SubmitBtn label="다음" disabled={!passwordForm.formState.isValid} />
          </form>
        )}

        {/* Step 3: 닉네임 */}
        {step === 3 && (
          <form onSubmit={nameForm.handleSubmit(onSignupComplete)} className="flex flex-col gap-3">
            <p className="text-[#888] text-sm">{email}</p>
            <p className="text-white font-semibold">닉네임을 설정해주세요</p>

            <div className="flex justify-center my-4">
              <div className="w-20 h-20 rounded-full bg-[#333] flex items-center justify-center text-3xl cursor-pointer hover:bg-[#444] transition-colors">
                👤
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <input
                {...nameForm.register("name")}
                type="text"
                placeholder="닉네임을 입력해주세요!"
                className={inputClass(!!nameForm.formState.errors.name)}
              />
              <ErrorMsg msg={nameForm.formState.errors.name?.message} />
            </div>

            <SubmitBtn label="회원가입 완료" disabled={!nameForm.formState.isValid} />
          </form>
        )}

      </div>
    </div>
  );
};

export default SignupPage;