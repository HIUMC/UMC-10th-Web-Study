import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import FloatingButton from '../components/FloatingButton';
import ConfirmModal from '../components/ConfirmModal';
import { useLogout } from '../hooks/useLogout';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { useSidebar } from '../hooks/useSidebar';

import hamburgerIcon from '../assets/hamburger-button.svg';
import searchIcon from '../assets/search-icon.svg';
import userIcon from '../assets/user-icon.svg';

const RootLayout = () => {
  const { isOpen: isSidebarOpen, close, toggle } = useSidebar();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('accessToken')
  );

  const [userName, setUserName] = useState(
    localStorage.getItem('name') || localStorage.getItem('nickname')
  );

  const location = useLocation();

  const logoutMutation = useLogout();
  const deleteUserMutation = useDeleteUser();

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    const syncAuthState = () => {
      setAccessToken(localStorage.getItem('accessToken'));
      setUserName(
        localStorage.getItem('name') || localStorage.getItem('nickname')
      );
    };

    window.addEventListener('auth-change', syncAuthState);
    window.addEventListener('storage', syncAuthState);

    syncAuthState();

    return () => {
      window.removeEventListener('auth-change', syncAuthState);
      window.removeEventListener('storage', syncAuthState);
    };
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSidebarOpen, close]);

  useEffect(() => {
    if (!isSidebarOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        window.dispatchEvent(new Event('auth-change'));
      },
      onError: () => {
        window.dispatchEvent(new Event('auth-change'));
      },
    });
  };

  const handleWithdraw = () => {
    deleteUserMutation.mutate(undefined, {
      onSuccess: () => {
        setIsWithdrawModalOpen(false);
        window.dispatchEvent(new Event('auth-change'));
      },
    });
  };

  return (
    <div className="app-layout">
      <header className="header">
        <div className="header-left">
          {!isAuthPage && (
            <button
              type="button"
              className="hamburger-button"
              onClick={toggle}
              aria-label="사이드바 열고 닫기"
              aria-expanded={isSidebarOpen}
              aria-controls="sidebar"
            >
              <img src={hamburgerIcon} alt="" />
            </button>
          )}

          <Link to="/" className="logo">
            돌려돌려 LP판
          </Link>
        </div>

        <div className="header-right">
          <Link to="/" className="search-icon">
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
                disabled={logoutMutation.isPending}
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
        <div className="sidebar-backdrop" onClick={close} />
      )}

      {!isAuthPage ? (
        <div className="layout-body">
          <aside
            id="sidebar"
            className={`sidebar transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'open' : ''
            }`}
          >
            <nav>
              <Link to="/" onClick={close}>
                <img src={searchIcon} alt="찾기" className="sidebar-icon" />
                찾기
              </Link>

              <Link to="/mypage" onClick={close}>
                <img src={userIcon} alt="마이페이지" className="sidebar-icon" />
                마이페이지
              </Link>
            </nav>

            <button
              type="button"
              className="withdraw-button"
              onClick={() => setIsWithdrawModalOpen(true)}
            >
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

      {isWithdrawModalOpen && (
        <ConfirmModal
          message="정말 탈퇴하시겠습니까?"
          confirmText="예"
          cancelText="아니오"
          onConfirm={handleWithdraw}
          onCancel={() => setIsWithdrawModalOpen(false)}
          isLoading={deleteUserMutation.isPending}
        />
      )}
    </div>
  );
};

export default RootLayout;