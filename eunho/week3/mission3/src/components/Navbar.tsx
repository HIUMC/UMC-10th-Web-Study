import { NavLink } from "react-router-dom";
import { LINKS, type LinkItem } from "../constants/LINKS";

export const Navbar = () => {
  return (
    <nav>
      <div className="flex gap-3 p-4">
        {LINKS.map(({ to, label }: LinkItem) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }: { isActive: boolean }) => {
              return isActive ? "text-[#b2dab1] font-bold" : "text-gray-500";
            }}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
