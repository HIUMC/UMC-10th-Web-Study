import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MyPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <h1 className="text-4xl font-bold text-white">마이페이지</h1>
      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
      >
        로그아웃
      </button>
    </div>
  );
}

export default MyPage;
