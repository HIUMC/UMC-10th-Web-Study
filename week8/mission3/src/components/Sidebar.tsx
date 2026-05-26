import { Home, PlusCircle, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContextValue";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { to: "/", label: "홈", icon: Home },
  { to: "/search", label: "찾기", icon: Search },
  { to: "/lp/create", label: "LP 등록", icon: PlusCircle },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { accessToken, withdraw, isWithdrawPending } = useAuth();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const handleWithdraw = async () => {
    await withdraw();
    setIsWithdrawModalOpen(false);
    onClose();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-[92px] z-40 flex h-[calc(100dvh-92px)] w-64 flex-col bg-[#111111] text-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
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

        {accessToken ? (
          <div className="border-t border-white/10 px-3 py-4">
            <button
              type="button"
              onClick={() => setIsWithdrawModalOpen(true)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-white/10 hover:text-[#ff1493]"
            >
              <Trash2 size={18} />
              <span>탈퇴하기</span>
            </button>
          </div>
        ) : (
          <div className="border-t border-white/10 px-5 py-4 text-xs text-gray-400">
            돌려돌려LP판
          </div>
        )}
      </aside>

      {isWithdrawModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdraw-title"
            className="relative w-full max-w-md rounded-lg bg-[#282b33] px-8 py-16 text-center text-white shadow-2xl"
          >
            <button
              type="button"
              aria-label="탈퇴 모달 닫기"
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute right-6 top-6 rounded-full p-1 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              <X size={22} />
            </button>

            <h2 id="withdraw-title" className="text-lg font-bold">
              정말 탈퇴하시겠습니까?
            </h2>

            <div className="mt-9 flex justify-center gap-8">
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={isWithdrawPending}
                className="h-10 w-24 rounded-lg bg-slate-200 font-bold text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isWithdrawPending ? "처리 중" : "예"}
              </button>
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                disabled={isWithdrawPending}
                className="h-10 w-24 rounded-lg bg-[#ff1493] font-bold text-white transition-colors hover:bg-[#e80f84] disabled:cursor-not-allowed disabled:opacity-60"
              >
                아니요
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
};

export default Sidebar;
