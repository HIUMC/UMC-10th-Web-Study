import { Outlet, useLocation, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";

const CATEGORIES = [
  {
    to: "/movies/popular",
    label: "인기 영화",
    emoji: "🔥",
    desc: "지금 가장 많이 본 영화",
    color: "from-orange-900/40 to-transparent",
    border: "border-orange-500/20 hover:border-orange-400/40",
  },
  {
    to: "/movies/now_playing",
    label: "현재 상영 중",
    emoji: "🎬",
    desc: "극장에서 만날 수 있는 영화",
    color: "from-purple-900/40 to-transparent",
    border: "border-purple-500/20 hover:border-purple-400/40",
  },
  {
    to: "/movies/top_rated",
    label: "평점 높은 영화",
    emoji: "⭐",
    desc: "관객이 선택한 명작들",
    color: "from-yellow-900/40 to-transparent",
    border: "border-yellow-500/20 hover:border-yellow-400/40",
  },
  {
    to: "/movies/upcoming",
    label: "개봉 예정",
    emoji: "🗓",
    desc: "곧 만나볼 기대작",
    color: "from-teal-900/40 to-transparent",
    border: "border-teal-500/20 hover:border-teal-400/40",
  },
];

const HomePage = () => {
  const { pathname } = useLocation();
  const isRoot = pathname === "/";

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />

      {isRoot && (
        <div className="flex flex-col items-center">
          <section className="relative w-full flex flex-col items-center justify-center text-center px-4 py-28 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#dda5e3]/8 rounded-full blur-[120px]" />
              <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-[#b2dab1]/6 rounded-full blur-[100px]" />
            </div>

            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#dda5e3]/70 mb-4">
              YEOPFLIX
            </p>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-5 tracking-tight">
              보고 싶은{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dda5e3] to-[#b2dab1]">
                영화
              </span>
              를<br />
              찾아보세요
            </h1>
            <p className="text-white/50 text-lg md:text-xl max-w-xl leading-relaxed mb-10">
              인기 영화부터 평점 높은 작품까지, 취향에 맞는 영화를 한눈에
              확인하세요.
            </p>
            <Link
              to="/movies/popular"
              className="px-8 py-3.5 bg-[#dda5e3] hover:bg-[#c98fd0] text-neutral-950 font-semibold rounded-full transition-colors text-sm"
            >
              지금 둘러보기 →
            </Link>
          </section>

          <section className="w-full max-w-4xl px-4 pb-24">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-6 text-center">
              카테고리
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CATEGORIES.map(({ to, label, emoji, desc, color, border }) => (
                <Link
                  key={to}
                  to={to}
                  className={`relative group flex flex-col gap-2 p-5 rounded-2xl bg-gradient-to-br ${color} bg-white/[0.03] border ${border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40`}
                >
                  <span className="text-3xl">{emoji}</span>
                  <p className="font-semibold text-sm text-white">{label}</p>
                  <p className="text-xs text-white/40 leading-snug">{desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default HomePage;
