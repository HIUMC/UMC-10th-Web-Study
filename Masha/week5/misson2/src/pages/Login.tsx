import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authApi } from "../api/authApi";

const Login = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/paid";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (mode === "signup" && !name.trim()) {
      setMessage("이름을 입력해주세요.");
      return;
    }

    try {
      if (mode === "signup") {
        await authApi.post("/v1/auth/signup", {
          name,
          email,
          password,
          bio: "Soomflix 사용자입니다.",
          avatar: "https://avatars.githubusercontent.com/u/55682610?v=4",
        });

        setMessage("회원가입 완료! 이제 로그인해주세요.");
        setMode("login");
        setPassword("");
        return;
      }

      const { data } = await authApi.post("/v1/auth/signin", {
        email,
        password,
      });

      console.log("로그인 응답:", data);

      const accessToken = data.accessToken ?? data.data?.accessToken;
      const refreshToken = data.refreshToken ?? data.data?.refreshToken;
      const userId = data.id ?? data.data?.id;
      const userName = data.name ?? data.data?.name;

      if (!accessToken || !refreshToken) {
        setMessage("서버 응답에서 토큰을 찾지 못했습니다.");
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          id: userId,
          name: userName,
        })
      );

      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      setMessage(
        mode === "signup"
          ? "회원가입 실패: 이미 가입된 이메일인지 확인해주세요."
          : "로그인 실패: 이메일 또는 비밀번호를 확인해주세요."
      );
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
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.14)",
          padding: "36px",
          borderRadius: "24px",
        }}
      >
        <Link to="/" style={{ color: "#cbd5e1", textDecoration: "none" }}>
          ← 홈으로
        </Link>

        <p style={{ color: "#38bdf8", fontWeight: 700, marginTop: "32px" }}>
          SOOMFLIX
        </p>

        <h1 style={{ fontSize: "38px", margin: "8px 0 12px" }}>
          {mode === "login" ? "로그인" : "회원가입"}
        </h1>

        <form onSubmit={handleSubmit} style={{ marginTop: "28px" }}>
          {mode === "signup" && (
            <input
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                marginBottom: "12px",
                borderRadius: "12px",
                border: "none",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          )}

          <input
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              marginBottom: "12px",
              borderRadius: "12px",
              border: "none",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              marginBottom: "16px",
              borderRadius: "12px",
              border: "none",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />

          {message && (
            <p style={{ color: "#fca5a5", fontSize: "14px" }}>{message}</p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#4f46e5",
              color: "white",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage("");
            setPassword("");
          }}
          style={{
            width: "100%",
            marginTop: "14px",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent",
            color: "#cbd5e1",
            cursor: "pointer",
          }}
        >
          {mode === "login"
            ? "아직 계정이 없나요? 회원가입"
            : "이미 계정이 있나요? 로그인"}
        </button>
      </div>
    </div>
  );
};

export default Login;