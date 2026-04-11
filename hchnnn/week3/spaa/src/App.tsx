import React, { useState, useEffect } from 'react';

const Home = () => <div className="text-2xl font-bold">🏠 홈 페이지</div>;
const Service = () => <div className="text-2xl font-bold">🛠️ 서비스 안내 페이지</div>;
const About = () => <div className="text-2xl font-bold">📖 소개 페이지</div>;

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderContent = () => {
    switch (currentPath) {
      case '/': return <Home />;
      case '/service': return <Service />;
      case '/about': return <About />;
      default: return <div className="text-red-500">404 Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pt-20">
      <nav className="mb-10 space-x-4">
        <button 
          onClick={() => navigate('/')} 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition"
        >
          Home
        </button>
        <button 
          onClick={() => navigate('/service')} 
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded transition"
        >
          Service
        </button>
        <button 
          onClick={() => navigate('/about')} 
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded transition"
        >
          About
        </button>
      </nav>

      <div className="p-10 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        {renderContent()}
      </div>

      <p className="mt-10 text-gray-500 font-mono">Current Path: {currentPath}</p>
    </div>
  );
}