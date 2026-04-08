import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postSignup } from "../apis/auth";

type Step = "email" | "password" | "name";

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordCheckError, setPasswordCheckError] = useState("");
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const handleBack = () => {
    if (step === "email") navigate(-1);
    else if (step === "password") setStep("email");
    else if (step === "name") setStep("password");
  };

  const validateEmail = () => {
    if (!email) return "이메일을 입력해주세요.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "올바른 이메일 형식이 아닙니다.";
    return "";
  };

  const validatePassword = () => {
    if (!password) return "비밀번호를 입력해주세요.";
    if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
    if (password.length > 20) return "비밀번호는 20자 이하여야 합니다.";
    return "";
  };

  const validatePasswordCheck = () => {
    if (!passwordCheck) return "비밀번호를 다시 입력해주세요.";
    if (password !== passwordCheck) return "비밀번호가 일치하지 않습니다.";
    return "";
  };

  const handleEmailNext = () => {
    const error = validateEmail();
    setEmailError(error);
    if (!error) setStep("password");
  };

  const handlePasswordNext = () => {
    const pwError = validatePassword();
    const pwCheckError = validatePasswordCheck();
    setPasswordError(pwError);
    setPasswordCheckError(pwCheckError);
    if (!pwError && !pwCheckError) setStep("name");
  };

  const handleSignup = async () => {
    if (!name.trim()) {
      setNameError("이름을 입력해주세요.");
      return;
    }
    setNameError("");
    setIsSubmitting(true);
    try {
      await postSignup({ email, password, name });
      navigate("/login");
    } catch (error: unknown) {
      const err = error as { message?: string };
      alert(err.message ?? "회원가입에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-[300px] flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center mb-2">
          <button
            onClick={handleBack}
            className="text-white text-xl mr-auto cursor-pointer"
          >
            &#8249;
          </button>
          <span className="text-white text-lg font-semibold absolute left-1/2 -translate-x-1/2">
            회원가입
          </span>
        </div>

        {/* Step 1: Email */}
        {step === "email" && (
          <>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-600 bg-transparent text-white p-3 rounded-md cursor-pointer hover:bg-gray-800 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.5 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.8 6C12.3 13 17.7 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/>
                <path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.8-6z"/>
                <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.3 0-11.7-4.2-13.6-10l-7.8 6C6.6 42.6 14.6 48 24 48z"/>
              </svg>
              구글 로그인
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-600" />
              <span className="text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-600" />
            </div>

            <div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailNext()}
                className={`w-full bg-transparent border rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors
                  ${emailError ? "border-red-500" : "border-gray-600"}`}
                type="email"
                placeholder="이메일을 입력해주세요!"
              />
              {emailError && (
                <div className="text-red-500 text-sm mt-1">{emailError}</div>
              )}
            </div>

            <button
              type="button"
              onClick={handleEmailNext}
              className="w-full bg-gray-700 text-white p-3 rounded-md font-medium hover:bg-gray-600 transition-colors cursor-pointer"
            >
              다음
            </button>
          </>
        )}

        {/* Step 2: Password */}
        {step === "password" && (
          <>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <span>{email}</span>
            </div>

            <div>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-transparent border rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors pr-10
                    ${passwordError ? "border-red-500" : "border-gray-600"}`}
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요!"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? "👁" : "🙈"}
                </button>
              </div>
              {passwordError && (
                <div className="text-red-500 text-sm mt-1">{passwordError}</div>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordNext()}
                  className={`w-full bg-transparent border rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors pr-10
                    ${passwordCheckError ? "border-red-500" : "border-gray-600"}`}
                  type={showPasswordCheck ? "text" : "password"}
                  placeholder="비밀번호를 다시 한 번 입력해주세요!"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPasswordCheck ? "👁" : "🙈"}
                </button>
              </div>
              {passwordCheckError && (
                <div className="text-red-500 text-sm mt-1">{passwordCheckError}</div>
              )}
            </div>

            <button
              type="button"
              onClick={handlePasswordNext}
              className="w-full bg-gray-700 text-white p-3 rounded-md font-medium hover:bg-gray-600 transition-colors cursor-pointer"
            >
              다음
            </button>
          </>
        )}

        {/* Step 3: Name & Profile */}
        {step === "name" && (
          <>
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center overflow-hidden">
                <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
            </div>

            <div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                className={`w-full bg-transparent border rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors
                  ${nameError ? "border-red-500" : "border-gray-600"}`}
                type="text"
                placeholder="이름을 입력해주세요!"
              />
              {nameError && (
                <div className="text-red-500 text-sm mt-1">{nameError}</div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSignup}
              disabled={isSubmitting}
              className="w-full bg-pink-500 text-white p-3 rounded-md font-medium hover:bg-pink-600 transition-colors cursor-pointer disabled:bg-gray-500"
            >
              회원가입 완료
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
