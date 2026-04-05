import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const baseClass = "px-3 py-1 transition-colors";
  const activeClass = ({ isActive }: { isActive: boolean }) => 
    isActive ? `${baseClass} text-red-500 font-bold` : `${baseClass} text-white hover:text-gray-400`;

  return (
    <nav className="flex justify-center gap-8 p-6 border-b border-gray-800 bg-black sticky top-0 z-50">
      <NavLink to="/" className={activeClass}>홈</NavLink>
      <NavLink to="/movies/popular" className={activeClass}>인기 영화</NavLink>
      <NavLink to="/movies/now_playing" className={activeClass}>상영 중</NavLink>
      <NavLink to="/movies/top_rated" className={activeClass}>평점 높은</NavLink>
      <NavLink to="/movies/upcoming" className={activeClass}>개봉 예정</NavLink>
    </nav>
  );
};

export default Navbar;