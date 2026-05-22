import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HomeLayout from "./HomeLayout";

export default function ProtectedLayout() {
  const { isLoggedIn, isAuthLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
    }
  }, [isAuthLoading, isLoggedIn]);

  if (isAuthLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <HomeLayout />;
}
