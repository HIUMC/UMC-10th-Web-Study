import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../apis/auth";
import { useEffect, useState } from "react";
import type { ResponseMyInfoDto } from "../types/auth";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();

  useEffect(() => {
    const getData = async () => {
      if (!accessToken) return;
      try {
        const response = await getMyInfo();
        setData(response);
      } catch (error) {
        console.error("내 정보를 불러오는데 실패했습니다:", error);
      }
    };
    getData();
  }, [accessToken]);

  return (
    <nav className="shrink-0 h-[72px] w-full flex justify-between items-center px-6 z-50 bg-white/50 dark:bg-[#1e1e24] border-b border-slate-200 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-slate-800 dark:text-white hover:text-pink-600 dark:hover:text-pink-500 transition-colors"
          aria-label="메뉴 열기"
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

        <div
          className="text-pink-600 dark:text-pink-500 font-extrabold text-xl tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
        >
          돌려돌려LP판
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!accessToken ? (
          <>
            <button
              className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-[#2a2b36] hover:bg-slate-200 dark:hover:bg-[#32333f] text-slate-700 dark:text-gray-300 transition-colors rounded-lg"
              onClick={() => navigate("/login")}
            >
              로그인
            </button>
            <button
              className="px-4 py-2 text-sm font-medium bg-pink-600 hover:bg-pink-500 text-white transition-colors rounded-lg shadow-sm"
              onClick={() => navigate("/signup")}
            >
              회원가입
            </button>
          </>
        ) : (
          <>
            <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-gray-300 mr-2">
              <strong className="text-pink-600 dark:text-pink-400">
                {data?.data?.name}
              </strong>
              님 반갑습니다.
            </span>

            <button
              className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-[#2a2b36] hover:bg-slate-200 dark:hover:bg-[#32333f] text-slate-500 hover:text-pink-600 transition-colors rounded-lg"
              onClick={logout}
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
