// src/components/navbar.tsx
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: '홈' },
  { path: '/movies/popular', label: '인기 영화' },
  { path: '/movies/now-playing', label: '상영 중' },
  { path: '/movies/top-rated', label: '평점 높은' },
  { path: '/movies/upcoming', label: '개봉 예정' },
];

const Navbar = () => {
  return (
    <nav className="navbar">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            isActive ? 'navbar-link active' : 'navbar-link'
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;