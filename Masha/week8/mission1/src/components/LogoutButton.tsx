import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useAuth";

const LogoutButton = () => {
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.clear();
        navigate("/login");
      },
      onError: () => {
        localStorage.clear();
        navigate("/login");
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      className="text-sm text-white/70 hover:text-white disabled:opacity-50"
    >
      {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
};

export default LogoutButton;