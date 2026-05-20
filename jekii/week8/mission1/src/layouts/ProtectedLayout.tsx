import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다. 로그인해주세요!");
      navigate("/login", {
        replace: true,
        state: {
          from: `${location.pathname}${location.search}`,
        },
      });
    }
  }, [accessToken, navigate, location]);

  if (!accessToken) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedLayout;
