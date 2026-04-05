import { Link, Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-black text-white">
      <nav className="border-b border-white/5 bg-[#171717]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight text-pink-500"
          >
            돌려돌려LP판
          </Link>

          <div className="flex items-center gap-2 text-sm font-semibold">
            <Link
              to="/login"
              className="rounded bg-black px-3 py-2 text-white transition hover:bg-white/10"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="rounded bg-pink-500 px-3 py-2 text-white transition hover:bg-pink-400"
            >
              회원가입
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
