import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#111] flex items-center justify-between px-6 py-4 z-50">
      <span
        onClick={() => navigate("/")}
        className="text-[#FF2E7E] font-bold text-xl cursor-pointer"
      >
        돌려돌려LP판
      </span>
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
    </nav>
  );
};
