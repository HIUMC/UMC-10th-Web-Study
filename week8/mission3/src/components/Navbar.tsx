import { Link, useNavigate } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";
import { QUERY_KEY } from "../constants/key";
import { useAuth } from "../context/authContextValue";

interface NavbarProps {
  isSidebarOpen?: boolean;
  onSidebarClick?: () => void;
}

export default function Navbar({ isSidebarOpen, onSidebarClick }: NavbarProps) {
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
            type="button"
            onClick={onSidebarClick}
            aria-label={isSidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
            aria-expanded={isSidebarOpen}
            className="flex h-10 w-10 items-center justify-center text-gray-300 transition-colors hover:text-white"
          >
            <Menu size={34} strokeWidth={2.8} />
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
