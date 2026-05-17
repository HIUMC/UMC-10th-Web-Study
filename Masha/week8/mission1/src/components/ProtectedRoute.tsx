import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const isLogin = !!localStorage.getItem("accessToken");

  if (!isLogin) {
    const redirectPath = location.pathname + location.search;

    alert("로그인이 필요한 서비스입니다. 로그인을 해주세요.");

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;