import { Navigate, Outlet, Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-950 text-stone-100">
      <nav
        className="sticky top-0 z-50 flex items-center justify-between
                   px-6 md:px-10 py-4
                   border-b border-zinc-800
                   bg-zinc-950/90 backdrop-blur-sm"
      >
        <Link to="/" className="flex items-baseline gap-0 group">
          <span
            className="text-xl font-black tracking-[0.18em] text-amber-400
                       group-hover:text-amber-300 transition-colors"
          >
            YEOP
          </span>
          <span className="text-xl font-black tracking-[0.18em] text-stone-100">
            RECORD
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { to: "/", label: "홈" },
            { to: "/collection", label: "컬렉션" },
            { to: "/artists", label: "아티스트" },
            { to: "/about", label: "소개" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `text-xs tracking-[0.25em] uppercase transition-colors ${
                  isActive
                    ? "text-amber-400"
                    : "text-stone-500 hover:text-stone-200"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/my"
            className="text-xs tracking-[0.2em] uppercase
                       bg-amber-400 px-4 py-2
                       text-zinc-950 font-bold
                       hover:bg-amber-300
                       transition-colors"
          >
            마이페이지
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-800 bg-zinc-950 px-6 md:px-10 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-baseline mb-3">
              <span className="text-lg font-black tracking-[0.15em] text-amber-400">
                YEOP
              </span>
              <span className="text-lg font-black tracking-[0.15em] text-stone-100">
                RECORD
              </span>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed">
              좋은 음악을 좋은 소리로.
              <br />
              엄선된 바이닐 컬렉션을 소개합니다.
            </p>
          </div>

          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-stone-600 mb-4">
              탐색
            </p>
            <div className="flex flex-col gap-2">
              {["신착반", "장르별", "추천 컬렉션", "중고 LP"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-stone-500 hover:text-amber-400 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-stone-600 mb-4">
              고객 지원
            </p>
            <div className="flex flex-col gap-2">
              {["주문 조회", "교환·반품", "공지사항", "문의하기"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-sm text-stone-500 hover:text-amber-400 transition-colors"
                  >
                    {item}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>

        <div
          className="max-w-6xl mx-auto border-t border-zinc-800/60 mt-10 pt-6
                     flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
        >
          <p className="text-zinc-700 text-xs tracking-wider">
            © 2026 YEOPRECORD. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Instagram", "YouTube", "Soundcloud"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-zinc-700 text-xs hover:text-amber-400 transition-colors tracking-wide"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProtectedLayout;
