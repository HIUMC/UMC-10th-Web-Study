import { useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomeLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { accessToken, logout, userName } = useAuth();
  const navigate = useNavigate();

  const isAuth = !!accessToken;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-[#121212] text-white">
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-zinc-800 bg-[#121212] px-6">
        <div className="flex items-center gap-6">
          <button
            onClick={toggleSidebar}
            className="text-zinc-400 transition-colors hover:text-amber-400"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M7.95 11.95h32m-32 12h32m-32 12h32"
              />
            </svg>
          </button>
          <Link
            to="/"
            className="flex items-center gap-1 text-[22px] font-black tracking-[0.18em] uppercase"
          >
            <span className="text-amber-400">YEOP</span>
            <span className="text-stone-100">CORD</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {isAuth ? (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-zinc-300">
                <strong className="text-white">{userName || "회원"}</strong>님
                반갑습니다.
              </span>
              <button
                onClick={handleLogout}
                className="text-zinc-400 transition-colors hover:text-amber-400"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link
                to="/login"
                className="text-zinc-300 transition-colors hover:text-white"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-amber-400 px-4 py-2 text-black transition-colors hover:bg-amber-300"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 transition-opacity"
            onClick={toggleSidebar}
          />
        )}

        <aside
          className={`absolute inset-y-0 left-0 z-50 flex w-[240px] flex-col justify-between border-r border-zinc-800 bg-[#121212] py-8 transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex flex-col gap-2 px-4">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800/50 hover:text-amber-400"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              찾기
            </Link>
            <Link
              to="/my"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800/50 hover:text-amber-400"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              마이페이지
            </Link>
          </nav>

          <div className="px-8">
            <button className="text-[13px] text-zinc-500 transition-colors hover:text-red-400">
              탈퇴하기
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <button
        onClick={() => navigate("/lp/create")}
        className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-black shadow-lg transition-transform hover:scale-105 hover:bg-amber-300"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
}
