import { type RefObject } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";
import { QUERY_KEY } from "../constants/key";
import { useAuth } from "../context/authContextValue";

interface NavbarProps {
  isSidebarOpen?: boolean;
  onSidebarClick?: () => void;
  sidebarToggleButtonRef?: RefObject<HTMLButtonElement | null>;
}

export default function Navbar({
  isSidebarOpen,
  onSidebarClick,
  sidebarToggleButtonRef,
}: NavbarProps) {
  const { accessToken, logout, isLogoutPending } = useAuth();
  const navigate = useNavigate();

  const { data: myInfo } = useQuery({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
    enabled: Boolean(accessToken),
  });

  const name = myInfo?.data.name ?? null;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="w-full bg-[#111111] text-white">
      <nav className="flex h-[92px] items-center justify-between px-6">
        <div className="flex items-center gap-7">
          <button
            ref={sidebarToggleButtonRef}
            type="button"
            onClick={onSidebarClick}
            aria-label={isSidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
            aria-expanded={isSidebarOpen}
            className="flex h-10 w-10 items-center justify-center text-gray-300 transition-colors hover:text-white"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
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
            className="text-3xl font-extrabold text-[#ff1493] transition-opacity hover:opacity-85"
          >
            돌려돌려LP판
          </Link>
        </div>

        <div className="flex items-center gap-7 text-base font-bold">
          {accessToken ? (
            <>
              <Link
                to="/search"
                aria-label="검색"
                className="flex h-10 w-10 items-center justify-center transition-colors hover:text-[#ff1493]"
              >
                <Search size={26} strokeWidth={3} />
              </Link>
              <span className="whitespace-nowrap text-sm font-medium">
                {name ? `${name}님 반갑습니다.` : "반갑습니다."}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLogoutPending}
                className="whitespace-nowrap text-sm font-medium transition-colors hover:text-[#ff1493] disabled:cursor-not-allowed disabled:opacity-50"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="transition-colors hover:text-[#ff1493]">
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-[#ff1493] px-4 py-3 transition-colors hover:bg-[#e80f84]"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
