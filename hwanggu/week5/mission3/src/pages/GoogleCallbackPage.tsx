import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken") || params.get("token");
    const refreshToken = params.get("refreshToken");

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken || "");
      navigate("/mypage");
    } else {
      alert("구글 로그인에 실패했습니다.");
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      로그인 중...
    </div>
  );
};

export default GoogleCallbackPage;
