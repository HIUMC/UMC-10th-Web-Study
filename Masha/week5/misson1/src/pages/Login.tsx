import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Login = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/paid";

  const isStrongPassword = (value: string) => {
    const hasLetter = /[A-Za-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    return value.length >= 8 && hasLetter && hasNumber;
  };

  const getUsers = () => {
    return JSON.parse(localStorage.getItem("users") || "[]");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!id.trim() || !password.trim()) {
      setMessage("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (mode === "signup") {
      if (id.length < 4) {
        setMessage("아이디는 4자 이상 입력해주세요.");
        return;
      }

      if (!isStrongPassword(password)) {
        setMessage("비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.");
        return;
      }

      if (password !== passwordCheck) {
        setMessage("비밀번호가 일치하지 않습니다.");
        return;
      }

      const users = getUsers();
      const exists = users.some((user: any) => user.id === id);

      if (exists) {
        setMessage("이미 존재하는 아이디입니다.");
        return;
      }

      localStorage.setItem("users", JSON.stringify([...users, { id, password }]));

      setMessage("회원가입이 완료되었습니다. 이제 로그인해주세요.");
      setMode("login");
      setPassword("");
      setPasswordCheck("");
      return;
    }

    const users = getUsers();
    const user = users.find((user: any) => user.id === id && user.password === password);

    if (!user) {
      setMessage("아이디 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    localStorage.setItem("token", `token-${id}`);
    navigate(from, { replace: true });
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
          backgroundColor: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: "24px",
          padding: "36px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
        }}
      >
        <Link to="/" style={{ color: "#cbd5e1", textDecoration: "none" }}>
          ← 홈으로 돌아가기
        </Link>

        <p style={{ color: "#38bdf8", fontWeight: 700, marginTop: "32px" }}>
          MOVIE SERVICE
        </p>

        <h1 style={{ fontSize: "38px", margin: "8px 0 12px" }}>
          {mode === "login" ? "로그인" : "회원가입"}
        </h1>

        <form onSubmit={handleSubmit} style={{ marginTop: "28px" }}>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디"
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "none",
              marginBottom: "12px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "none",
              marginBottom: "12px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />

          {mode === "signup" && (
            <input
              type="password"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
              placeholder="비밀번호 확인"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "none",
                marginBottom: "12px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          )}

          {message && (
            <p style={{ color: message.includes("완료") ? "#86efac" : "#fca5a5" }}>
              {message}
            </p>
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
            setPasswordCheck("");
          }}
          style={{
            width: "100%",
            marginTop: "14px",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)",
            backgroundColor: "transparent",
            color: "#cbd5e1",
            fontSize: "15px",
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