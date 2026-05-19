import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContextValue"
import AppLayout from "./AppLayout";

let lastAuthWarningPath = "";

export const ProtectedLayout = () => {
  const {accessToken} = useAuth();
  const location = useLocation();

  if(!accessToken){
    const requestedPath = `${location.pathname}${location.search}${location.hash}`;

    if (lastAuthWarningPath !== requestedPath) {
      alert("로그인이 필요한 페이지입니다.");
      lastAuthWarningPath = requestedPath;
    }

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(requestedPath)}`}
        replace
        state={{ from: location }}
      />
    )
  }

  lastAuthWarningPath = "";

  return <AppLayout />
}
