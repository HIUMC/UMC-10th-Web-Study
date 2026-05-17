import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import FloatingButton from "../components/FloatingButton";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    window.innerWidth >= 1024
  );

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
        setIsSidebarOpen(false);
      } else if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed left-0 top-0 z-40 flex h-20 w-full items-center justify-between border-b border-white/10 bg-[#111] px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="text-3xl text-white/70 hover:text-white"
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
              <button onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login">로그인</Link>
              <Link
                to="/signup"
                className="rounded-lg bg-pink-500 px-5 py-3 font-bold"
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
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-50 bg-black/60"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-60 h-screen w-72 bg-[#151515] transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className="text-2xl font-extrabold text-pink-500"
          >
            돌려돌려LP판
          </Link>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="text-3xl text-white/70 hover:text-white"
          >
            ×
          </button>
        </div>

        <nav className="flex h-[calc(100vh-5rem)] flex-col justify-between px-6 py-8 text-lg font-semibold">
          <div className="space-y-6">
            <Link
              to="/search"
              onClick={() => setIsSidebarOpen(false)}
              className="block hover:text-pink-400"
            >
              🔍 찾기
            </Link>

            <Link
              to="/mypage"
              onClick={() => setIsSidebarOpen(false)}
              className="block hover:text-pink-400"
            >
              👤 마이페이지
            </Link>
          </div>

          <button className="text-left text-white/50 hover:text-white">
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