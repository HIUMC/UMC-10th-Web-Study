import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import FreeWebtoon from './pages/FreeWebtoon';
import PremiumWebtoon from './pages/PremiumWebtoon';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #ddd',
        backgroundColor: '#f5f7fa'
      }}>
        <div>
          <Link to="/" style={{ textDecoration: 'none', color: '#1d1f21', fontWeight: '700', fontSize: '20px' }}>
            Webtoon Hub
          </Link>
        </div>
        <nav style={{ display: 'flex', gap: '12px' }}>
          <Link to="/" style={{ color: '#333', textDecoration: 'none' }}>홈</Link>
          <Link to="/free/webtoon/1" style={{ color: '#333', textDecoration: 'none' }}>무료 웹툰</Link>
          <Link to="/premium/webtoon/1" style={{ color: '#333', textDecoration: 'none' }}>프리미엄</Link>
          {!isAuthenticated && (
            <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>로그인</Link>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/free/webtoon/1" element={<FreeWebtoon />} />
          <Route
            path="/premium/webtoon/1"
            element={
              <ProtectedRoute>
                <PremiumWebtoon />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div style={{ padding: '20px' }}><h2>페이지를 찾을 수 없습니다.</h2></div>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
