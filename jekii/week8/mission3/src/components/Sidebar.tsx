import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiTrash2, FiUser, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import useDeleteUser from "../hooks/mutations/useDeleteUser";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteUserMutation = useDeleteUser();

  const handleDeleteUser = () => {
    deleteUserMutation.mutate(undefined, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        navigate("/login");
      },
    });
  };

  return (
    <>
      <div
        className={`absolute inset-0 z-30 bg-black/50 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {accessToken && (
        <aside
          id="app-sidebar"
          className={`absolute top-0 left-0 h-full w-64 bg-white/80 dark:bg-[#1e1e24] border-r border-slate-200 dark:border-gray-800 z-40 p-5 shadow-xl backdrop-blur transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex h-full flex-col gap-2">
            <Link
              to="/search"
              onClick={onClose}
              className="flex items-center gap-3 p-3 rounded-xl text-slate-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-[#2a2b36] hover:text-pink-600 dark:hover:text-pink-500 transition-colors font-medium"
            >
              <FiSearch size={22} />
              <span>찾기</span>
            </Link>

            <Link
              to="/my"
              onClick={onClose}
              className="flex items-center gap-3 p-3 rounded-xl text-slate-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-[#2a2b36] hover:text-pink-600 dark:hover:text-pink-500 transition-colors font-medium"
            >
              <FiUser size={22} />
              <span>마이페이지</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="mt-auto flex items-center gap-3 rounded-xl p-3 text-left font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <FiTrash2 size={22} />
              <span>탈퇴하기</span>
            </button>
          </nav>
        </aside>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
          <section className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#272930]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                정말 탈퇴하시겠습니까?
              </h2>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label="탈퇴 모달 닫기"
              >
                <FiX />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-gray-300">
              탈퇴하면 계정 정보와 작성한 데이터가 삭제됩니다. 계속 진행할까요?
            </p>

            {deleteUserMutation.isError && (
              <p className="mt-4 text-sm text-pink-500">
                회원 탈퇴에 실패했습니다.
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                아니오
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={deleteUserMutation.isPending}
                className="rounded-xl bg-red-500 px-4 py-3 font-bold text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteUserMutation.isPending ? "탈퇴 중" : "예"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default Sidebar;
