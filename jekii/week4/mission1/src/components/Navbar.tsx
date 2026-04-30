import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "홈" },
  { to: "/movies/popular", label: "인기 영화" },
  { to: "/movies/now_playing", label: "상영 중" },
  { to: "/movies/top_rated", label: "평점 높은" },
  { to: "/movies/upcoming", label: "개봉 예정" },
];

export const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <NavLink to="/" className="text-2xl font-bold text-white">
          MOVIE
        </NavLink>

        <nav className="flex flex-wrap gap-5">
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-[#b2dab1] pb-1 text-[#b2dab1] font-semibold"
                  : "pb-1 text-gray-400 transition hover:text-white hover:font-semibold"
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
