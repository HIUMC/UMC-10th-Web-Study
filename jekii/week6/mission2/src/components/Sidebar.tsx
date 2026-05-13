import { Link } from "react-router-dom";
import { FiSearch, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { accessToken } = useAuth();
  return (
    <>
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/50 z-30 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      {accessToken && (
        <aside
          className={`         
          absolute top-0 left-0 h-full w-64 bg-white/50 dark:bg-[#1e1e24] border-r border-slate-200 dark:border-gray-800 z-40 p-5
          transition-transform duration-300 ease-in-out
         
          md:static md:translate-x-0 md:shrink-0
   
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <nav className="flex flex-col gap-2">
            <Link
              to="/search"
              className="flex items-center gap-3 p-3 rounded-xl text-slate-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-[#2a2b36] hover:text-pink-600 dark:hover:text-pink-500 transition-colors font-medium"
            >
              <FiSearch size={22} />
              <span>찾기</span>
            </Link>

            <Link
              to="/my"
              className="flex items-center gap-3 p-3 rounded-xl text-slate-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-[#2a2b36] hover:text-pink-600 dark:hover:text-pink-500 transition-colors font-medium"
            >
              <FiUser size={22} />
              <span>마이페이지</span>
            </Link>
          </nav>
        </aside>
      )}
    </>
  );
};

export default Sidebar;
