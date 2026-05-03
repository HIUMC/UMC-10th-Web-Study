import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // 1. 다양한 파라미터명 대응 (accessToken 또는 token)
    const accessToken = params.get("accessToken") || params.get("token");
    const refreshToken = params.get("refreshToken");

    if (accessToken) {
      // Access Token은 필수이므로 바로 저장
      localStorage.setItem("accessToken", accessToken);

      // 2. [리뷰 반영] Refresh Token이 있을 때만 저장
      // 빈 문자열("")이 저장되어 이후 재발급 요청 시 에러가 발생하는 것을 방지
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      navigate("/mypage");
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