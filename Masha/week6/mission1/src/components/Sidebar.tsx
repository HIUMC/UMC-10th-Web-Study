import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-56 border-r border-white/10 bg-[#121212] px-5 py-6 text-white md:block">
      <nav className="flex h-full flex-col justify-between">
        <div className="space-y-4">
          <Link to="/" className="block text-sm hover:text-pink-500">
            🔍 찾기
          </Link>
          <Link to="/mypage" className="block text-sm hover:text-pink-500">
            👤 마이페이지
          </Link>
        </div>

        <button className="text-left text-sm text-white/60 hover:text-pink-500">
          탈퇴하기
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;