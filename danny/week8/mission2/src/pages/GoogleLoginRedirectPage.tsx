import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GoogleLoginRedirectPage = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");

    if (accessToken && refreshToken) {
      handleLogin(accessToken, refreshToken);
      navigate("/my", { replace: true });
    }
  }, [handleLogin, navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black text-white">
      <p>구글 로그인 처리 중...</p>
    </div>
  );
};

export default GoogleLoginRedirectPage;
