import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get("userId") || searchParams.get("id");
    const name =
      searchParams.get("name") ||
      searchParams.get("nickname") ||
      "사용자";

    const accessToken =
      searchParams.get("accessToken") ||
      searchParams.get("access_token") ||
      searchParams.get("token");

    console.log("구글 콜백 전체 URL:", window.location.href);
    console.log("구글 콜백 accessToken:", accessToken);

    const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userId", userId || "");
      localStorage.setItem("nickname", name);

      sessionStorage.removeItem("redirectAfterLogin");

      navigate(redirectPath, { replace: true });
      return;
    }

    alert("구글 로그인에 실패했습니다.");
    navigate("/login", { replace: true });
  }, [navigate, searchParams]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-black text-white">
      구글 로그인 처리 중...
    </section>
  );
};

export default GoogleCallbackPage;