import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AuthRequiredModal from "../components/common/AuthRequiredModal";
import { useAuth } from "../context/AuthContext";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!accessToken) {
    return (
      <AuthRequiredModal
        onConfirm={() =>
          navigate("/login", {
            replace: true,
            state: { from: location.pathname + location.search },
          })
        }
        onCancel={() => navigate(-1)}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedLayout;
