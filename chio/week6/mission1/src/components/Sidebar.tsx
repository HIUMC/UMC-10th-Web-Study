import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { Search, User } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { isOpen },
  ref,
) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "flex items-center gap-3 whitespace-nowrap text-base font-bold transition-colors",
      isActive ? "text-[#ff1493]" : "text-white hover:text-[#ff1493]",
    ].join(" ");

  return (
    <aside
      ref={ref}
      className={[
        "fixed bottom-0 left-0 top-[92px] z-40 flex w-[200px] shrink-0 flex-col overflow-hidden bg-[#111111] text-white transition-transform duration-300 md:static md:top-auto md:h-full md:transition-[width]",
        isOpen
          ? "translate-x-0 md:w-[200px]"
          : "-translate-x-full md:w-0 md:translate-x-0",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-full w-[200px] flex-col px-8 py-10 transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <div className="flex flex-col gap-8">
          <NavLink to="/" className={linkClass}>
            <Search size={24} strokeWidth={3} />
            <span>찾기</span>
          </NavLink>

          <NavLink to="/my" className={linkClass}>
            <User size={24} strokeWidth={3} />
            <span>마이페이지</span>
          </NavLink>
        </div>

        <button
          type="button"
          className="mx-auto mt-auto w-fit whitespace-nowrap text-base font-bold text-white transition-colors hover:text-[#ff1493]"
        >
          탈퇴하기
        </button>
      </div>
    </aside>
  );
});

export default Sidebar;
