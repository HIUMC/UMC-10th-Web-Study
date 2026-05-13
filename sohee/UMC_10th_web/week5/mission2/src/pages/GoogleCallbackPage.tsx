import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      navigate("/login", { replace: true });
      return;
    }

    localStorage.setItem("accessToken", JSON.stringify(accessToken));
    localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
    window.location.replace("/my");
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      Signing in with Google...
    </div>
  );
};

export default GoogleCallbackPage;
