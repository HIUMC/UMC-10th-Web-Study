import { useMutation } from "@tanstack/react-query";
import { forwardRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { deleteMyAccount } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: "/search", label: "찾기" },
  { to: "/lp", label: "LP" },
];

const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ isOpen, onClose }, ref) => {
    const { accessToken, clearTokens } = useAuth();
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const items = accessToken
      ? [...navItems, { to: "/my", label: "마이페이지" }]
      : navItems;

    const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
      mutationFn: deleteMyAccount,
      onSuccess: () => {
        clearTokens();
        navigate("/login");
      },
      onError: () => alert("탈퇴에 실패했습니다. 다시 시도해주세요."),
    });

    return (
      <>
        <aside
          ref={ref}
          className={`fixed top-[57px] bottom-0 left-0 z-30 w-56 transform border-r border-gray-800 bg-gray-900 transition-transform duration-200 lg:static lg:top-auto lg:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex flex-col gap-1 p-4">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `rounded px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-pink-500/20 text-pink-300"
                      : "text-gray-200 hover:bg-gray-800"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {accessToken && (
              <div className="mt-4 flex flex-col gap-1 border-t border-gray-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="cursor-pointer rounded px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-800"
                >
                  탈퇴하기
                </button>
              </div>
            )}
          </nav>
        </aside>

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-80 rounded-2xl bg-gray-900 p-6 shadow-2xl mx-4">
              <h3 className="text-base font-semibold text-white">
                정말 탈퇴하시겠어요?
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다.
              </p>
              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="cursor-pointer rounded-lg bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-600"
                >
                  아니오
                </button>
                <button
                  type="button"
                  onClick={() => mutateDelete()}
                  disabled={isDeleting}
                  className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeleting ? "처리 중..." : "예"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
