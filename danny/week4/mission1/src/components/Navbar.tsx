import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/movies/popular", label: "인기 영화" },
  { to: "/movies/now_playing", label: "상영 중" },
  { to: "/movies/top_rated", label: "평점 높은" },
  { to: "/movies/upcoming", label: "개봉 예정" },
];

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-8 h-14">
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-white text-lg tracking-tight">
            YEOPFLIX
          </span>
        </NavLink>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#dda5e3]/20 text-[#dda5e3]"
                    : "text-white/50 hover:text-white/90 hover:bg-white/5"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};
