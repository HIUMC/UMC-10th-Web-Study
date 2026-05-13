import { NavLink } from 'react-router-dom';

const getNavLinkClassName = function ({ isActive }: { isActive: boolean }) {
  return isActive
    ? 'rounded-full bg-lime-300 px-4 py-2 text-sm font-semibold text-black'
    : 'rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20';
};

export default function Navbar() {
  return (
    <header className='border-b border-white/10 bg-black/40 backdrop-blur-md'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
        <NavLink to='/' className='text-xl font-bold text-lime-300'>
          JELLIE MOVIES
        </NavLink>

        <div className='flex items-center gap-3'>
          <nav className='flex flex-wrap gap-3'>
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

          <NavLink
            to='/login'
            className='rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20'
          >
            로그인
          </NavLink>
        </div>
      </div>
    </header>
  );
}