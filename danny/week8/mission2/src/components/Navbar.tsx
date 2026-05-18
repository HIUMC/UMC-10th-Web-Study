import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/mutations/useLogout";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";

interface NavbarProps {
  toggleSidebar: () => void;
  isSearchOpen: boolean;
  onSearchToggle: () => void;
}

export default function Navbar({
  toggleSidebar,
  isSearchOpen,
  onSearchToggle,
}: NavbarProps) {
  const { isLoggedIn } = useAuth();
  const { mutate: logout } = useLogout();
  const { data: myInfo } = useGetMyInfo();

  const userName = myInfo?.data?.name || "회원";

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-zinc-800 bg-[#121212] px-6">
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="사이드바 열기"
          className="text-zinc-400 transition-colors hover:text-amber-400"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M7.95 11.95h32m-32 12h32m-32 12h32"
            />
          </svg>
        </button>

        <Link
          to="/"
          className="flex items-center gap-1 text-[22px] font-black uppercase tracking-[0.18em]"
        >
          <span className="text-amber-400">YEOP</span>
          <span className="text-stone-100">CORD</span>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={onSearchToggle}
          aria-label={isSearchOpen ? "검색 닫기" : "검색 열기"}
          className="flex items-center gap-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
        >
          {isSearchOpen ? (
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
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
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
        </button>

        {isLoggedIn ? (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-zinc-300">
              <strong className="text-white">{userName}</strong>님 반갑습니다.
            </span>
            <button
              onClick={() => logout()}
              className="text-zinc-400 transition-colors hover:text-amber-400"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link
              to="/login"
              className="text-zinc-300 transition-colors hover:text-white"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="rounded-md bg-amber-400 px-4 py-2 text-black transition-colors hover:bg-amber-300"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
