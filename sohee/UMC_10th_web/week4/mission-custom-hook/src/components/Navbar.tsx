import { NavLink } from 'react-router-dom';
import { movieCategories } from '../lib/tmdb';

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:px-8">
        <NavLink
          to="/movies/popular"
          className="w-fit text-sm font-black uppercase tracking-[0.45em] text-amber-300"
        >
          CINE LOG
        </NavLink>

        <nav className="flex flex-wrap gap-2 text-sm font-medium text-slate-300">
          {movieCategories.map(({ key, label }) => (
            <NavLink
              key={key}
              to={`/movies/${key}`}
              className={({ isActive }: { isActive: boolean }) =>
                `rounded-full px-4 py-2 transition ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-lg shadow-amber-200/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
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
