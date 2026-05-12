import { Link, NavLink } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AUTH_STORAGE_KEYS, type StoredUser } from '../lib/authStorage';
import { movieCategories } from '../lib/tmdb';

const AppNavbar = () => {
  const { storedValue: currentUser } = useLocalStorage<StoredUser | null>(
    AUTH_STORAGE_KEYS.currentUser,
    null,
  );

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <NavLink
            to="/"
            className="w-fit text-sm font-black uppercase tracking-[0.45em] text-amber-300"
          >
            CINE LOG
          </NavLink>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {currentUser ? (
              <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 font-semibold text-emerald-200">
                {currentUser.name}님, 반가워요
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-amber-300 px-4 py-2 font-bold text-slate-950 transition hover:bg-amber-200"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>

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

export default AppNavbar;
