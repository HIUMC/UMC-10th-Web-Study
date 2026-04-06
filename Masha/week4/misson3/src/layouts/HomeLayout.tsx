import { Outlet, Link } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-8 py-4 bg-[#121212] border-b border-white/10">
        <Link to="/" className="text-pink-500 font-bold text-xl">
          돌려돌려LP판
        </Link>
        <div className="flex gap-4">
          <Link 
            to="/login" 
            className="px-4 py-2 text-sm font-medium hover:text-pink-500 transition"
          >
            로그인
          </Link>
          <Link 
            to="/signup" 
            className="px-4 py-2 text-sm font-medium bg-pink-500 rounded-md hover:bg-pink-600 transition"
          >
            회원가입
          </Link>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;