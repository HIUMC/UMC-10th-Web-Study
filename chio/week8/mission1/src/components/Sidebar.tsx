import { forwardRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, User, X } from "lucide-react";
import { useAuth } from "../context/authContextValue";
import useDeleteUser from "../hooks/queries/useDeleteUser";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { isOpen },
  ref,
) {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      clearAuth();
      setIsDeleteModalOpen(false);
      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.error("회원 탈퇴 오류", error);
      alert("회원 탈퇴에 실패했습니다.");
    },
  });

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "flex items-center gap-3 whitespace-nowrap text-base font-bold transition-colors",
      isActive ? "text-[#ff1493]" : "text-white hover:text-[#ff1493]",
    ].join(" ");

  const closeDeleteModal = () => {
    if (deleteUserMutation.isPending) {
      return;
    }

    setIsDeleteModalOpen(false);
  };

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
          onClick={() => setIsDeleteModalOpen(true)}
          className="mx-auto mt-auto w-fit whitespace-nowrap text-base font-bold text-white transition-colors hover:text-[#ff1493]"
        >
          탈퇴하기
        </button>

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-user-modal-title"
              className="relative flex min-h-[340px] w-full max-w-[560px] flex-col items-center justify-center rounded-2xl bg-[#282b33] px-8 py-14 text-white shadow-2xl shadow-black/60"
            >
              <button
                type="button"
                aria-label="탈퇴 확인 모달 닫기"
                onClick={closeDeleteModal}
                disabled={deleteUserMutation.isPending}
                className="absolute right-8 top-7 rounded-full p-1 text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500"
              >
                <X size={26} strokeWidth={3} />
              </button>

              <h2
                id="delete-user-modal-title"
                className="text-center text-xl font-black"
              >
                정말 탈퇴하시겠습니까?
              </h2>

              <div className="mt-12 flex items-center justify-center gap-8">
                <button
                  type="button"
                  onClick={() => deleteUserMutation.mutate()}
                  disabled={deleteUserMutation.isPending}
                  className="h-11 min-w-32 rounded-xl bg-slate-200 px-8 text-base font-black text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-zinc-300"
                >
                  {deleteUserMutation.isPending ? "처리 중" : "예"}
                </button>
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleteUserMutation.isPending}
                  className="h-11 min-w-32 rounded-xl bg-[#ff1493] px-8 text-base font-black text-white transition-colors hover:bg-[#ff45aa] disabled:cursor-not-allowed disabled:bg-pink-900 disabled:text-zinc-300"
                >
                  아니요
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </aside>
  );
});

export default Sidebar;
