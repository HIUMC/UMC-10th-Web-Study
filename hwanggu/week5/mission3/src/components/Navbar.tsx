import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#111] flex items-center justify-between px-6 py-4 z-50">
      <span
        onClick={() => navigate("/mypage")}
        className="text-[#FF2E7E] font-bold text-xl cursor-pointer"
      >
        돌려돌려LP판
      </span>
      <div className="flex gap-2">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/mypage")}
              className="px-4 py-2 rounded-lg border border-white text-white text-sm hover:bg-white hover:text-black transition-colors"
            >
              마이페이지
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-[#FF2E7E] text-white text-sm font-bold hover:opacity-85 transition-opacity"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 rounded-lg bg-[#FF2E7E] text-white text-sm font-bold hover:opacity-85 transition-opacity"
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </nav>
  );
};