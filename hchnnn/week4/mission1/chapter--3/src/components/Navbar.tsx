import { NavLink } from 'react-router-dom';

export default function Navbar() {
    const activeStyle = "text-purple-500 font-bold";
    const defaultStyle = "text-white hover:text-purple-300";

    return (
        <nav className="bg-gray-900 p-4 flex gap-6">
            <NavLink title="홈" to="/" className={({ isActive }) => isActive ? activeStyle : defaultStyle}>홈</NavLink>
            <NavLink title="인기" to="/movies/popular" className={({ isActive }) => isActive ? activeStyle : defaultStyle}>인기 영화</NavLink>
            <NavLink title="상영중" to="/movies/now-playing" className={({ isActive }) => isActive ? activeStyle : defaultStyle}>상영 중</NavLink>
            <NavLink title="평점높은" to="/movies/top-rated" className={({ isActive }) => isActive ? activeStyle : defaultStyle}>평점 높은</NavLink>
            <NavLink title="개봉예정" to="/movies/upcoming" className={({ isActive }) => isActive ? activeStyle : defaultStyle}>개봉 예정</NavLink>
        </nav>
    );
}