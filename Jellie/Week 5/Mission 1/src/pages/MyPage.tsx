import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MyPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div>
      <h1>마이페이지</h1>
      <p>로그인한 사용자만 볼 수 있는 페이지입니다.</p>

      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}