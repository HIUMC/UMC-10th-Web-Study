import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import useSidebar from "../hooks/useSidebar";

export default function AppLayout() {
  const sidebarRef = useRef<HTMLElement | null>(null);
  const sidebarToggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {
    isOpen: isSidebarOpen,
    close: closeSidebar,
    toggle: toggleSidebar,
  } = useSidebar();

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

      closeSidebar();
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closeSidebar, isSidebarOpen]);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSidebar, isSidebarOpen]);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return (
    <div className="flex h-dvh flex-col">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        isSearchOpen={isSearchOpen}
        onSidebarClick={toggleSidebar}
        onSearchClick={toggleSearch}
        sidebarToggleButtonRef={sidebarToggleButtonRef}
      />
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {isSidebarOpen && (
          <button
            type="button"
            aria-label="사이드바 닫기"
            onClick={closeSidebar}
            className="fixed inset-x-0 bottom-0 top-[92px] z-30 touch-none bg-black/40 md:hidden"
          />
        )}
        <Sidebar ref={sidebarRef} isOpen={isSidebarOpen} />
        <main
          className={[
            "min-w-0 flex-1",
            isSidebarOpen ? "overflow-hidden" : "overflow-y-auto",
          ].join(" ")}
        >
          <Outlet context={{ isSearchOpen }} />
        </main>
      </div>
    </div>
  );
}
