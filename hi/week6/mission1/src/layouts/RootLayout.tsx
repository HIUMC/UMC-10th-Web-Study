import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import FloatingButton from '../components/FloatingButton';
import hamburgerIcon from '../assets/hamburger-button.svg';
import searchIcon from '../assets/search-icon.svg';
import userIcon from '../assets/user-icon.svg';

const RootLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const accessToken = localStorage.getItem('accessToken');
  const userName =
    localStorage.getItem('name') || localStorage.getItem('nickname');

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('name');
    localStorage.removeItem('nickname');

    navigate('/login');
  };

  return (
    <div className="app-layout">
      <header className="header">
        <div className="header-left">
          {!isAuthPage && (
            <button
              type="button"
              className="hamburger-button"
              onClick={() => setIsSidebarOpen((prev)=> !prev)}
            >
              <img src={hamburgerIcon} alt="메뉴 열기" />
            </button>
          )}

          <Link to="/" className="logo">
            돌려돌려 LP판
          </Link>
        </div>

        <div className="header-right">
          <Link to="/search" className="search-icon">
            <img src={searchIcon} alt="검색" />
          </Link>

          {accessToken ? (
            <>
              <span className="welcome-text">
                {userName ? `${userName}님 반갑습니다.` : '반갑습니다.'}
              </span>
              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">
                로그인
              </Link>
              <Link to="/signup" className="signup-button-header">
                회원가입
              </Link>
            </>
          )}
        </div>
      </header>

      {!isAuthPage && isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {!isAuthPage ? (
        <div className="layout-body">
          <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <nav>
              <Link to="/search" onClick={() => setIsSidebarOpen(false)}>
                <img src={searchIcon} alt="찾기" className="sidebar-icon" />
                찾기
              </Link>

              <Link to="/mypage" onClick={() => setIsSidebarOpen(false)}>
                <img src={userIcon} alt="마이페이지" className="sidebar-icon" />
                마이페이지
              </Link>
            </nav>

            <button type="button" className="withdraw-button">
              탈퇴하기
            </button>
          </aside>

          <main className="main-content">
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="auth-main-content">
          <Outlet />
        </main>
      )}

      {!isAuthPage && <FloatingButton />}
    </div>
  );
};

export default RootLayout;