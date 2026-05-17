import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import FloatingButton from "../components/FloatingButton";
import useSidebar from "../hooks/useSidebar";

const HomeLayout = () => {
  const {
    isOpen: isSidebarOpen,
    close: closeSidebar,
    toggle: toggleSidebar,
  } = useSidebar(false);

  const [isLogin, setIsLogin] = useState(
    !!localStorage.getItem("accessToken")
  );

  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || "수민"
  );

  const handleLogout = () => {
    localStorage.clear();
    setIsLogin(false);
    setNickname("수민");
    window.location.href = "/";
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        closeSidebar();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [closeSidebar]);

  useEffect(() => {
    const handleNicknameChanged = () => {
      setNickname(localStorage.getItem("nickname") || "수민");
      setIsLogin(!!localStorage.getItem("accessToken"));
    };

    window.addEventListener("nicknameChanged", handleNicknameChanged);
    window.addEventListener("storage", handleNicknameChanged);

    return () => {
      window.removeEventListener("nicknameChanged", handleNicknameChanged);
      window.removeEventListener("storage", handleNicknameChanged);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSidebar]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed left-0 top-0 z-40 flex h-20 w-full items-center justify-between border-b border-white/10 bg-[#111] px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="사이드바 열기"
            aria-expanded={isSidebarOpen}
            className="text-3xl text-white/70 transition-colors duration-200 hover:text-white"
          >
            ☰
          </button>

          <Link to="/" className="text-3xl font-extrabold text-pink-500">
            돌려돌려LP판
          </Link>
        </div>

        <nav className="flex items-center gap-6 text-lg font-semibold">
          <button type="button" className="text-2xl">
            🔍
          </button>

          {isLogin ? (
            <>
              <span className="hidden sm:inline">
                {nickname}님 반갑습니다.
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="transition-colors duration-200 hover:text-pink-400"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="transition-colors duration-200 hover:text-pink-400"
              >
                로그인
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-pink-500 px-5 py-3 font-bold transition-colors duration-200 hover:bg-pink-600"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </header>

      {isSidebarOpen && window.innerWidth < 1024 && (
        <button
          type="button"
          onClick={closeSidebar}
          aria-label="사이드바 닫기"
          className="fixed inset-0 z-50 bg-black/60 transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-60 h-screen w-72 bg-[#151515] shadow-2xl transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link
            to="/"
            onClick={closeSidebar}
            className="text-2xl font-extrabold text-pink-500"
          >
            돌려돌려LP판
          </Link>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="사이드바 닫기"
            className="text-3xl text-white/70 transition-colors duration-200 hover:text-white"
          >
            ×
          </button>
        </div>

        <nav className="flex h-[calc(100vh-5rem)] flex-col justify-between overflow-y-auto overscroll-contain px-6 py-8 text-lg font-semibold">
          <div className="space-y-6">
            <Link
              to="/search"
              onClick={closeSidebar}
              className="block transition-colors duration-200 hover:text-pink-400"
            >
              🔍 찾기
            </Link>

            <Link
              to="/mypage"
              onClick={closeSidebar}
              className="block transition-colors duration-200 hover:text-pink-400"
            >
              👤 마이페이지
            </Link>
          </div>

          <button className="text-left text-white/50 transition-colors duration-200 hover:text-white">
            탈퇴하기
          </button>
        </nav>
      </aside>

      <main className="min-h-screen bg-black pt-20">
        <Outlet />
      </main>

      <FloatingButton />
    </div>
  );
};

export default HomeLayout;