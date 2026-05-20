import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import Sidebar from "../components/Sidebar.tsx";
import useSidebar from "../hooks/useSidebar.ts";

const HomeLayout = () => {
  const { isOpen, close, toggle } = useSidebar();

  return (
    <div className="h-dvh flex flex-col">
      <Navbar isSidebarOpen={isOpen} onSidebarClick={toggle} />

      <div className="flex min-h-0 flex-1">
        <Sidebar isOpen={isOpen} onClose={close} />

        <main className={`min-w-0 flex-1 ${isOpen ? "overflow-hidden" : "overflow-y-auto"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
