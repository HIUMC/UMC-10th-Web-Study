import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import FloatingButton from "../components/FloatingButton";

const HomeLayout = () => {
  // 👉 큰 화면에서는 기본 열림
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    window.innerWidth >= 1024
  );

  const isLogin = !!localStorage.getItem("accessToken");
  const nickname = localStorage.getItem("nickname") || "수민";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ✅ 화면 크기 변경 시 사이드바 자동 제어
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 헤더 */}
      <header className="fixed left-0 top-0 z-40 flex h-20 w-full items-center justify-between border-b border-white/10 bg-[#111] px-6">
        <div className="flex items-center gap-4">
          {/* 햄버거 버튼 */}
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

        {/* 오른쪽 */}
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

      {/* 🔥 사이드바 바깥 클릭 영역 */}
      {isSidebarOpen && window.innerWidth < 1024 && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-50 bg-black/60"
        />
      )}

      {/* 🔥 사이드바 */}
      <aside
        className={`fixed left-0 top-0 z-60 h-screen w-72 bg-[#151515] transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* 상단 */}
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

        {/* 메뉴 */}
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

      {/* 메인 */}
      <main className="min-h-screen bg-black pt-20">
        <Outlet />
      </main>

      <FloatingButton />
    </div>
  );
};

export default HomeLayout;