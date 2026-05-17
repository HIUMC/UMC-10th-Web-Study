import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LpCreateModal from "../components/LpCreateModal";
import WithdrawConfirmModal from "../components/WithdrawConfirmModal";

export default function HomeLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLpModalOpen, setIsLpModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-[#121212] text-white">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="relative flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 transition-opacity"
            onClick={toggleSidebar}
          />
        )}

        <aside
          className={`absolute inset-y-0 left-0 z-50 flex w-[240px] flex-col justify-between border-r border-zinc-800 bg-[#121212] py-8 transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex flex-col gap-2 px-4">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800/50 hover:text-amber-400"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              찾기
            </Link>
            <Link
              to="/my"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800/50 hover:text-amber-400"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              마이페이지
            </Link>
          </nav>

          <div className="px-8">
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="text-[13px] text-zinc-500 transition-colors hover:text-red-400"
            >
              탈퇴하기
            </button>
          </div>
        </aside>

        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      <button
        onClick={() => setIsLpModalOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-black shadow-lg transition-transform hover:scale-105 hover:bg-amber-300"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      {isLpModalOpen && (
        <LpCreateModal onClose={() => setIsLpModalOpen(false)} />
      )}

      {isWithdrawModalOpen && (
        <WithdrawConfirmModal onClose={() => setIsWithdrawModalOpen(false)} />
      )}
    </div>
  );
}
