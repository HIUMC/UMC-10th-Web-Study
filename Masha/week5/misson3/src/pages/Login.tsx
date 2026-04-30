import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authApi } from "../api/authApi";

const Login = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // ✅ 회원가입용 name 추가
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/paid";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    // ✅ 회원가입
    if (mode === "signup") {
      try {
        await authApi.post("/v1/auth/signup", {
          name: name || "익명",
          email,
          password,
        });

        setMessage("회원가입 완료! 이제 로그인하세요 😊");
        setMode("login");
      } catch (error) {
        setMessage("회원가입 실패 (이미 존재하는 계정일 수 있음)");
      }
      return;
    }

    // ✅ 로그인
    try {
      const { data } = await authApi.post("/v1/auth/signin", {
        email,
        password,
      });

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ id: data.id, name: data.name })
      );

      navigate(from, { replace: true });
    } catch (error) {
      setMessage("로그인 실패 (이메일/비밀번호 확인)");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.08)",
          padding: "32px",
          borderRadius: "20px",
        }}
      >
        <Link to="/" style={{ color: "#aaa" }}>
          ← 홈으로
        </Link>

        <h1 style={{ marginTop: "20px" }}>
          {mode === "login" ? "로그인" : "회원가입"}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* ✅ 회원가입일 때만 이름 입력 */}
          {mode === "signup" && (
            <input
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "12px", marginTop: "10px" }}
            />
          )}

          <input
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "12px", marginTop: "10px" }}
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "12px", marginTop: "10px" }}
          />

          {message && (
            <p style={{ color: "pink", marginTop: "10px" }}>{message}</p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "16px",
              padding: "12px",
              background: "#4f46e5",
              color: "white",
              border: "none",
            }}
          >
            {mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>

        {/* ✅ Google 로그인 버튼 */}
        <button
          onClick={() => {
            window.location.href =
              "http://localhost:8000/v1/auth/google/login";
          }}
          style={{
            width: "100%",
            marginTop: "12px",
            padding: "12px",
            background: "white",
            color: "black",
            border: "none",
            cursor: "pointer",
          }}
        >
          Google로 로그인
        </button>

        {/* 모드 전환 버튼 */}
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          style={{
            marginTop: "12px",
            background: "transparent",
            color: "#aaa",
            border: "none",
            cursor: "pointer",
          }}
        >
          {mode === "login"
            ? "회원가입 하러가기"
            : "이미 계정 있음? 로그인"}
        </button>
      </div>
    </div>
  );
};

export default Login;