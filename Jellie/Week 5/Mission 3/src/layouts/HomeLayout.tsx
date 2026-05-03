import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomeLayout() {
  const { accessToken, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
        <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            UMC Auth
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link to="/" className="hover:text-blue-600">
              홈
            </Link>
            <Link to="/my" className="hover:text-blue-600">
              마이페이지
            </Link>

            {accessToken ? (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition"
              >
                로그아웃
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                로그인
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}