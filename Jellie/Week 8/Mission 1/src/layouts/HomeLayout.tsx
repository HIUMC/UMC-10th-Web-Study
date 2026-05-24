import { Link, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMyInfo } from "../hooks/queries/useUser";
import { useDebounce } from "../hooks/useDebounce";
import backgroundImage from "../assets/Background.png";

const SEARCH_DEBOUNCE_DELAY = 300;

export default function HomeLayout() {
  const { accessToken, logout } = useAuth();
  const { data } = useMyInfo();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_DELAY);

  const userName = data?.data.name;

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);

      if (debouncedSearch.trim()) {
        nextParams.set("search", debouncedSearch.trim());
      } else {
        nextParams.delete("search");
      }

      return nextParams;
    });

    navigate(
      debouncedSearch.trim()
        ? "/lps?search=" + encodeURIComponent(debouncedSearch.trim())
        : "/lps",
    );
  }, [debouncedSearch, navigate, setSearchParams]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  return (
    <div
      className="relative min-h-screen text-[#e8ded4] bg-[#0f1720] overflow-x-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15, 23, 32, 0.72), rgba(15, 23, 32, 0.88)), url(" +
          backgroundImage +
          ")",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#0f1720]/82 backdrop-blur-md border-b border-[#e8ded4]/15">
        <nav className="h-full px-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-2xl text-[#e8ded4] hover:text-[#3fafc0] transition"
              aria-label="사이드바 열기"
            >
              ☰
            </button>

            <Link
              to="/"
              className="text-2xl font-black text-[#3fafc0] tracking-wide"
            >
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
                value={searchInput}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="LP 검색"
                autoFocus={isSearchOpen}
                className="w-full px-4 py-2 rounded-full bg-[#1a1f24]/70 border border-[#3fafc0]/70 text-sm text-[#e8ded4] outline-none placeholder:text-[#9fbfc2]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-semibold shrink-0">
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className={
                "text-xl hover:text-[#3fafc0] transition " +
                (isSearchOpen ? "text-[#3fafc0]" : "text-[#e8ded4]")
              }
              aria-label="검색 토글"
            >
              🔍
            </button>

            {accessToken ? (
              <>
                <span className="hidden lg:block text-[#e8ded4]">
                  {userName ? userName + "님 반갑습니다." : "반갑습니다."}
                </span>

                <button onClick={logout} className="hover:text-[#3fafc0]">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-[#3fafc0]">
                  로그인
                </Link>

                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full bg-[#3fafc0] text-[#0f1720] shadow-lg shadow-black/30 hover:bg-[#5bc3d4] transition"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </nav>

        <div
          className={
            "md:hidden px-5 bg-[#0f1720]/90 backdrop-blur-md border-b border-[#e8ded4]/15 overflow-hidden transition-[max-height,opacity] duration-300 ease-out " +
            (isSearchOpen
              ? "max-h-24 opacity-100 pb-4"
              : "max-h-0 opacity-0 pb-0")
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
              value={searchInput}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="LP 검색"
              autoFocus={isSearchOpen}
              className="w-full px-4 py-3 rounded-full bg-[#1a1f24]/70 border border-[#3fafc0]/70 text-[#e8ded4] outline-none placeholder:text-[#9fbfc2]"
            />
          </div>
        </div>
      </header>

      <aside
        className={
          "fixed top-16 left-0 bottom-0 z-40 w-64 bg-[#0f1720]/90 backdrop-blur-md border-r border-[#e8ded4]/15 p-6 transition-transform duration-300 " +
          (isSidebarOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="flex flex-col gap-6 text-lg">
          <Link
            to="/lps"
            onClick={() => setIsSidebarOpen(false)}
            className="hover:text-[#3fafc0] transition"
          >
            💿 LP 목록
          </Link>

          {accessToken && (
            <Link
              to="/my"
              onClick={() => setIsSidebarOpen(false)}
              className="hover:text-[#3fafc0] transition"
            >
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

      <main className="relative z-10 pt-24 px-6 md:px-12 lg:px-20 pb-16">
        <Outlet />
      </main>

      {accessToken && (
        <button
          onClick={() => navigate("/lp/new")}
          className="fixed right-6 bottom-6 z-40 w-14 h-14 rounded-full bg-[#3fafc0] text-[#0f1720] text-3xl font-bold shadow-xl shadow-black/40 hover:scale-105 hover:bg-[#5bc3d4] transition"
        >
          +
        </button>
      )}
    </div>
  );
}