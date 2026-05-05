import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  const sidebarRef = useRef<HTMLElement | null>(null);
  const sidebarToggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.matchMedia("(min-width: 768px)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsSidebarOpen(event.matches);
    };

    setIsSidebarOpen(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        sidebarRef.current?.contains(target) ||
        sidebarToggleButtonRef.current?.contains(target)
      ) {
        return;
      }

      setIsSidebarOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-dvh flex-col">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onSidebarClick={toggleSidebar}
        sidebarToggleButtonRef={sidebarToggleButtonRef}
      />
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {isSidebarOpen && (
          <button
            type="button"
            aria-label="사이드바 닫기"
            className="fixed inset-x-0 bottom-0 top-[92px] z-30 bg-black/40 md:hidden"
          />
        )}
        <Sidebar ref={sidebarRef} isOpen={isSidebarOpen} />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
