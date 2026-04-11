import { NavLink } from 'react-router-dom';

export const NavBar = () => {
  return (
    <nav className="flex gap-4 p-4 bg-gray-900">
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? 'text-yellow-400' : 'text-white'}
      >
        홈
      </NavLink>
      <NavLink
        to="/movies/popular"
        className={({ isActive }) => isActive ? 'text-yellow-400' : 'text-white'}
      >
        인기 영화
      </NavLink>
      <NavLink
        to="/movies/upcoming"
        className={({ isActive }) => isActive ? 'text-yellow-400' : 'text-white'}
      >
        개봉 예정
      </NavLink>
      <NavLink
        to="/movies/top-rated"
        className={({ isActive }) => isActive ? 'text-yellow-400' : 'text-white'}
      >
        평점 높은
      </NavLink>
      <NavLink
        to="/movies/now-playing"
        className={({ isActive }) => isActive ? 'text-yellow-400' : 'text-white'}
      >
        상영 중
      </NavLink>
    </nav>
  );
};
