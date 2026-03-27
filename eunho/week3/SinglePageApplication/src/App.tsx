import { useState, useEffect, type MouseEvent } from "react";

const Home = () => (
  <div className="text-2xl font-bold text-blue-500">🏠 홈 페이지입니다</div>
);

const About = () => (
  <div className="text-2xl font-bold text-green-500">
    📖 어바웃 페이지입니다
  </div>
);

const Contact = () => (
  <div className="text-2xl font-bold text-purple-500">
    📞 연락처 페이지입니다
  </div>
);

const NotFound = () => (
  <div className="text-2xl font-bold text-red-500">404 - not found</div>
);

// --- 2. 커스텀 Link 컴포넌트 (핵심!) ---
// a 태그의 새로고침 기능을 막고 History API를 쓰는 녀석이야.
const Link = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // 새로고침 방지 (이게 없으면 SPA가 아님)

    // 주소창 URL만 슬쩍 바꿈 (서버 요청 X)
    window.history.pushState({}, "", to);

    // pushState는 이벤트를 발생시키지 않아서, 우리가 직접 "주소 바뀌었어!"라고 알려줘야 함
    const navEvent = new PopStateEvent("popstate");
    window.dispatchEvent(navEvent);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
    >
      {children}
    </a>
  );
};

function App() {
  // 현재 경로를 상태로 관리 (이게 바뀌어야 리액트가 리렌더링됨)
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // 뒤로가기나 앞으로가기(popstate)를 감지
    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  // 경로에 따라 어떤 컴포넌트를 보여줄지 결정 (조건부 렌더링)
  const renderPage = () => {
    switch (currentPath) {
      case "/":
        return <Home />;
      case "/about":
        return <About />;
      case "/contact":
        return <Contact />;
      default:
        return <NotFound />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-10">
      <h1 className="text-4xl font-black mb-10 text-gray-800 underline decoration-yellow-400">
        EUNHO'S WEB
      </h1>

      {/* 내비게이션 바 */}
      <nav className="flex gap-4 mb-10">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/blahblah">Wrong Link</Link>
      </nav>

      {/* 실제 콘텐츠가 렌더링되는 곳 */}
      <main className="p-10 bg-white shadow-xl rounded-2xl w-full max-w-md text-center">
        {renderPage()}
      </main>

      <footer className="mt-10 text-gray-400 text-sm">
        현재 경로:{" "}
        <span className="font-mono text-red-400 font-bold">{currentPath}</span>
      </footer>
    </div>
  );
}

export default App;
