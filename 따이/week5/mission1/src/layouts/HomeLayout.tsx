import { Outlet, useNavigate } from "react-router-dom";

const HomeLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="h-dvh flex flex-col bg-gray-400">
      <nav className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
        <button
          onClick={() => navigate("/")}
          className="text-pink-500 text-xl font-bold cursor-pointer"
        >
          돌러돌려LP판
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-1.5 border border-gray-500 text-white rounded text-sm hover:border-gray-300 transition-colors cursor-pointer"
          >
            로그인
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-1.5 bg-pink-500 text-white rounded text-sm hover:bg-pink-600 transition-colors cursor-pointer"
          >
            회원가입
          </button>
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
