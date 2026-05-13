import { Home, PlusCircle, Search, X } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { to: "/", label: "홈", icon: Home },
  { to: "/search", label: "검색", icon: Search },
  { to: "/lp/create", label: "LP 등록", icon: PlusCircle },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-[92px] z-40 flex h-[calc(100dvh-92px)] w-64 flex-col bg-[#111111] text-white transition-transform duration-300 md:sticky md:top-[92px] md:z-0 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 md:hidden">
          <span className="text-sm font-bold text-[#ff1493]">메뉴</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="사이드바 닫기"
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-gray-200 transition-colors hover:bg-white/10 hover:text-[#ff1493]"
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 px-5 py-4 text-xs text-gray-400">
          돌려돌려LP판
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
