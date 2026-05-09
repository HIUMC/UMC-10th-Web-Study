import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSignout } from "../apis/auth";

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ localStorage를 직접 읽지 않고 accessToken 존재 여부로만 판별
  // (렌더링 타이밍 문제 방지를 위해 상태 대신 매번 읽기)
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const nickname = localStorage.getItem("nickname");

  // ✅ useMutation으로 로그아웃 처리
  const logoutMutation = useMutation({
    mutationFn: postSignout,
    onSuccess: () => {
      // 모든 캐시 제거 후 로그인 페이지로
      queryClient.clear();
      navigate("/login", { replace: true });
    },
    onError: () => {
      // 서버 에러가 나도 로컬 토큰은 이미 지워졌으니 로그인으로 이동
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#111] flex items-center justify-between px-6 py-4 z-50">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="text-white">
          <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="currentColor" strokeLinecap="round"
              strokeLinejoin="round" strokeWidth="4"
              d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
          </svg>
        </button>
        <span
          onClick={() => navigate("/lps")}
          className="text-[#FF2E7E] font-bold text-xl cursor-pointer"
        >
          돌려돌려LP판
        </span>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            {nickname && (
              <span className="text-white text-sm">{nickname}님 반갑습니다.</span>
            )}
            <button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="px-4 py-2 rounded-lg bg-[#FF2E7E] text-white text-sm font-bold hover:opacity-85 transition-opacity disabled:opacity-50"
            >
              {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg border border-white text-white text-sm hover:bg-white hover:text-black transition-colors"
            >
              로그인
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 rounded-lg bg-[#FF2E7E] text-white text-sm font-bold hover:opacity-85 transition-opacity"
            >
              회원가입
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};