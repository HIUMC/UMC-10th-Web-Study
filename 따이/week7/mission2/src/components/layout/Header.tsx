import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGetMyInfo } from "../../hooks/queries/useGetMyInfo";
import HamburgerIcon from "../icons/HamburgerIcon";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const { data: me } = useGetMyInfo();

  const isAuthed = !!accessToken;

  return (
    <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="cursor-pointer rounded p-1 text-white hover:bg-gray-800 lg:hidden"
          aria-label="사이드바 열기"
        >
          <HamburgerIcon className="h-6 w-6" />
        </button>
        <Link
          to="/"
          className="text-xl font-bold text-pink-500 hover:opacity-80"
        >
          돌러돌려LP판
        </Link>
      </div>

      {isAuthed ? (
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-white sm:inline">
            {me?.data?.name
              ? `${me.data.name}님 반갑습니다.`
              : "반갑습니다."}
          </span>
          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate("/");
            }}
            className="cursor-pointer rounded border border-gray-500 px-3 py-1.5 text-sm text-white transition-colors hover:border-gray-300"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="cursor-pointer rounded border border-gray-500 px-4 py-1.5 text-sm text-white transition-colors hover:border-gray-300"
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="cursor-pointer rounded bg-pink-500 px-4 py-1.5 text-sm text-white transition-colors hover:bg-pink-600"
          >
            회원가입
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
