import { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import Sidebar from "../components/Sidebar.tsx";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarToggleButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleSidebarClick = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-dvh flex flex-col">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onSidebarClick={handleSidebarClick}
        sidebarToggleButtonRef={sidebarToggleButtonRef}
      />

      <div className="flex min-h-0 flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
