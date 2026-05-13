import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HomeLayout from "./HomeLayout";

export default function ProtectedLayout() {
  const { accessToken } = useAuth();
  const location = useLocation();

  const isAuth = !!accessToken;

  useEffect(() => {
    if (!isAuth) {
      alert("로그인이 필요한 서비스입니다.");
    }
  }, [isAuth]);

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <HomeLayout />;
}
