import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo } from "../apis/auth";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get("accessToken") || params.get("token");
    const refreshToken = params.get("refreshToken");

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // ✅ nickname 저장 후 /lps로 이동
      getMyInfo()
        .then((res) => {
          localStorage.setItem("nickname", res.data.name);
        })
        .catch(() => {}) // 실패해도 이동은 함
        .finally(() => {
          navigate("/lps", { replace: true });
        });
    } else {
      alert("구글 로그인에 실패했습니다.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      로그인 중...
    </div>
  );
};

export default GoogleCallbackPage;