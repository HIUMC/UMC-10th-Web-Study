import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: "/search", label: "찾기" },
  { to: "/lp", label: "LP" },
];

const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ isOpen, onClose }, ref) => {
    const { accessToken } = useAuth();
    const items = accessToken
      ? [...navItems, { to: "/my", label: "마이페이지" }]
      : navItems;

    return (
      <aside
        ref={ref}
        className={`fixed top-[57px] bottom-0 left-0 z-30 w-56 transform border-r border-gray-800 bg-gray-900 transition-transform duration-200 lg:static lg:top-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-1 p-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-pink-500/20 text-pink-300"
                    : "text-gray-200 hover:bg-gray-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    );
  },
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
