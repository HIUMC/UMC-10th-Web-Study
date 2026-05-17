import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FloatingButton from "../components/layout/FloatingButton";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-dvh flex-col bg-gray-950 text-white">
      <Header onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />
      <div className="relative flex flex-1">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 top-[57px] z-20 bg-black/40 lg:hidden"
            aria-hidden
          />
        )}
        <Sidebar
          ref={sidebarRef}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <FloatingButton />
    </div>
  );
};

export default HomeLayout;
