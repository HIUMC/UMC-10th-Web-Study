import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 👁 보기 토글
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 🔐 비밀번호 검증
  const isLengthValid = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  const isPasswordValid =
    isLengthValid && hasLetter && hasNumber && hasSpecial;

  const isMatch = password === passwordConfirm && passwordConfirm.length > 0;

  return (
    <section className="min-h-[calc(100dvh-6rem)] bg-black px-8 py-16 text-white">
      <div className="mx-auto w-full max-w-120">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 text-3xl text-white/70 hover:text-white"
        >
          ‹
        </button>

        <h1 className="mb-10 text-center text-5xl font-bold">회원가입</h1>

        <form className="space-y-6">
          <input
            type="email"
            placeholder="이메일을 입력해주세요!"
            className="h-16 w-full rounded-lg bg-[#1c1c1c] px-5"
          />

          {/* 🔥 비밀번호 */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요!"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-16 w-full rounded-lg bg-[#1c1c1c] px-5 pr-14"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {/* 🔐 조건 */}
          <div className="text-sm space-y-1">
            <p className={isLengthValid ? "text-green-400" : "text-white/40"}>
              ✔ 8자 이상
            </p>
            <p className={hasLetter ? "text-green-400" : "text-white/40"}>
              ✔ 영문 포함
            </p>
            <p className={hasNumber ? "text-green-400" : "text-white/40"}>
              ✔ 숫자 포함
            </p>
            <p className={hasSpecial ? "text-green-400" : "text-white/40"}>
              ✔ 특수문자 포함 (!@#$%^&*)
            </p>
          </div>

          {/* 🔥 비밀번호 확인 */}
          <div className="relative">
            <input
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="비밀번호를 다시 입력해주세요!"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="h-16 w-full rounded-lg bg-[#1c1c1c] px-5 pr-14"
            />

            <button
              type="button"
              onClick={() => setShowPasswordConfirm((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
            >
              {showPasswordConfirm ? "🙈" : "👁"}
            </button>
          </div>

          {/* 🔥 일치 여부 */}
          {passwordConfirm.length > 0 && (
            <p className={isMatch ? "text-green-400" : "text-red-400"}>
              {isMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}
            </p>
          )}

          <input
            type="text"
            placeholder="닉네임을 입력해주세요!"
            className="h-16 w-full rounded-lg bg-[#1c1c1c] px-5"
          />

          <button
            type="button"
            disabled={!isPasswordValid || !isMatch}
            className={`h-16 w-full rounded-lg text-lg font-bold ${
              isPasswordValid && isMatch
                ? "bg-pink-500 hover:bg-pink-600"
                : "bg-gray-700 text-white/40"
            }`}
          >
            회원가입
          </button>
        </form>
      </div>
    </section>
  );
};

export default SignupPage;