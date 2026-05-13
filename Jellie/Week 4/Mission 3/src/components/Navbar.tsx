import { NavLink, useLocation } from 'react-router-dom';

const getNavLinkClassName = function ({ isActive }: { isActive: boolean }) {
  return isActive
    ? 'rounded-full bg-lime-300 px-4 py-2 text-sm font-semibold text-black'
    : 'rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20';
};

export default function Navbar() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';

  return (
    <header className='border-b border-white/10 bg-black/40 backdrop-blur-md'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6'>
        <NavLink to='/' className='shrink-0 text-lg font-bold text-lime-300 sm:text-xl'>
          JELLIE MOVIES
        </NavLink>

        <div className='flex items-center gap-4 sm:gap-5'>
          {!isAuthPage ? (
            <nav className='hidden items-center gap-2 lg:flex'>
              <NavLink to='/popular' className={getNavLinkClassName}>
                인기 영화
              </NavLink>
              <NavLink to='/upcoming' className={getNavLinkClassName}>
                개봉 예정
              </NavLink>
              <NavLink to='/top-rated' className={getNavLinkClassName}>
                평점 높은 영화
              </NavLink>
              <NavLink to='/now-playing' className={getNavLinkClassName}>
                상영 중
              </NavLink>
            </nav>
          ) : null}

          {!isAuthPage ? (
            <nav className='hidden items-center gap-2 md:flex lg:hidden'>
              <NavLink to='/popular' className={getNavLinkClassName}>
                인기
              </NavLink>
              <NavLink to='/upcoming' className={getNavLinkClassName}>
                예정
              </NavLink>
            </nav>
          ) : null}

          <div className='h-8 w-px bg-white/15' />

          <div className='flex items-center gap-2'>
            <NavLink
              to='/login'
              className='rounded-md bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 sm:px-4 sm:text-sm'
            >
              로그인
            </NavLink>

            <NavLink
              to='/signup'
              className='rounded-md bg-lime-400 px-3 py-2 text-xs font-semibold text-black transition hover:bg-lime-300 sm:px-4 sm:text-sm'
            >
              회원가입
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}