import { Outlet, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black border-b border-gray-800">
      <span
        className="text-yellow-500 font-bold text-xl cursor-pointer"
        onClick={() => navigate('/')}
      >
        zeco's UMC
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 border border-gray-600 text-white rounded hover:bg-gray-800 text-sm"
        >
          로그인
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellowq-600 text-sm"
        >
          회원가입
        </button>
      </div>
    </nav>
  );
}

function RootLayout() {
  return (
    <div className="flex flex-col h-dvh bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
