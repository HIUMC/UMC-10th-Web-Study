import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleLoginRedirectPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const accessToken =
      searchParams.get("accessToken") || searchParams.get("access");
    const refreshToken =
      searchParams.get("refreshToken") || searchParams.get("refresh");

    if (!accessToken || !refreshToken) {
      alert("구글 로그인에 실패했습니다.");
      navigate("/login", { replace: true });
      return;
    }

    login(accessToken, refreshToken);
    navigate("/", { replace: true });
  }, [searchParams, login, navigate]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0b0f] text-white">
      <p>구글 로그인 처리 중...</p>
    </main>
  );
}