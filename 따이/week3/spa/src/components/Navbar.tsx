import { Link, NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "text-white font-semibold" : "text-gray-400 hover:text-white transition";

export default function Navbar() {
  return (
    <nav className="bg-[#1a1a2e] px-8 h-14 flex items-center justify-between">
      <Link to="/" className="text-white font-bold text-lg">
        ⚡ My SPA
      </Link>
      <div className="flex gap-6 text-sm">
        <NavLink to="/" end className={linkClass}>홈</NavLink>
        <NavLink to="/posts" className={linkClass}>게시글</NavLink>
        <NavLink to="/about" className={linkClass}>소개</NavLink>
      </div>
    </nav>
  );
}
