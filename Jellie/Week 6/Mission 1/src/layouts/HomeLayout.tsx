import { Link, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMyInfo } from "../hooks/queries/useUser";

export default function HomeLayout() {
  const { accessToken, logout } = useAuth();
  const { data } = useMyInfo();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search") || "";
  const userName = data?.data.name;

  const handleSearchChange = (value: string) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set("search", value);
      } else {
        prev.delete("search");
      }

      return prev;
    });

    navigate("/lps?search=" + value);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#111114] border-b border-white/10">
        <nav className="h-full px-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-2xl"
              aria-label="사이드바 열기"
            >
              ☰
            </button>

            <Link to="/" className="text-2xl font-black text-pink-500">
              3.33
            </Link>
          </div>

          <div className="flex-1 flex justify-end overflow-hidden">
            <div
              className={
                "hidden md:block w-full max-w-md overflow-hidden transition-[clip-path,opacity] duration-500 ease-out " +
                (isSearchOpen
                  ? "opacity-100 [clip-path:inset(0_0_0_0)]"
                  : "pointer-events-none opacity-0 [clip-path:inset(0_0_0_100%)]")
              }
            >
              <input
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="LP 검색"
                autoFocus={isSearchOpen}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-pink-500 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-semibold shrink-0">
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className={
                "text-xl hover:text-pink-400 transition " +
                (isSearchOpen ? "text-pink-400" : "text-white")
              }
              aria-label="검색 토글"
            >
              🔍
            </button>

            {accessToken ? (
              <>
                <span className="hidden lg:block">
                  {userName ? userName + "님 반갑습니다." : "반갑습니다."}
                </span>

                <button onClick={logout} className="hover:text-pink-400">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-pink-400">
                  로그인
                </Link>

                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-pink-500 text-white"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </nav>

        <div
          className={
            "md:hidden px-5 bg-[#111114] border-b border-white/10 overflow-hidden transition-[max-height,opacity] duration-300 ease-out " +
            (isSearchOpen ? "max-h-24 opacity-100 pb-4" : "max-h-0 opacity-0 pb-0")
          }
        >
          <div
            className={
              "overflow-hidden transition-[clip-path] duration-500 ease-out " +
              (isSearchOpen
                ? "[clip-path:inset(0_0_0_0)]"
                : "[clip-path:inset(0_0_0_100%)]")
            }
          >
            <input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="LP 검색"
              autoFocus={isSearchOpen}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-pink-500 outline-none"
            />
          </div>
        </div>
      </header>

      <aside
        className={
          "fixed top-16 left-0 bottom-0 z-40 w-64 bg-[#111114] border-r border-white/10 p-6 transition-transform duration-300 " +
          (isSidebarOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="flex flex-col gap-6 text-lg">
          <Link to="/lps" onClick={() => setIsSidebarOpen(false)}>
            💿 LP 목록
          </Link>

          {accessToken && (
            <Link to="/my" onClick={() => setIsSidebarOpen(false)}>
              👤 마이페이지
            </Link>
          )}
        </div>
      </aside>

      {isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30"
          aria-label="사이드바 닫기"
        />
      )}

      <main className="pt-24 px-6 md:px-12 lg:px-20 pb-16">
        <Outlet />
      </main>

      {accessToken && (
        <button
          onClick={() => navigate("/lp/new")}
          className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-pink-500 text-3xl font-bold shadow-lg"
        >
          +
        </button>
      )}
    </div>
  );
}