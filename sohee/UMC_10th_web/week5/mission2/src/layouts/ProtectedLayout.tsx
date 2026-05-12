import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to={"/login"} replace />;
  }

  return (
    <div className="flex flex-col h-dvh justify-center items-center text-center">
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
