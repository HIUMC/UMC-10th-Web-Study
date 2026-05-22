import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { postSignout, getMyInfo } from "../apis/auth";

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ localStorage 대신 useQuery로 로그인 상태 + 닉네임 관리
  // 이미 MyPage나 LpDetailPage에서 캐시된 데이터를 그대로 사용 (추가 요청 없음)
  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    staleTime: 1000 * 60 * 5,
    retry: false,
    // 토큰 없으면 아예 요청 안 함
    enabled: !!localStorage.getItem("accessToken"),
  });

  const isLoggedIn = !!myInfo?.data;
  const nickname = myInfo?.data?.name;

  const logoutMutation = useMutation({
    mutationFn: postSignout,
    onSuccess: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    },
    onError: () => {
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