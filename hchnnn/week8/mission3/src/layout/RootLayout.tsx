import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import FloatingButton from '../components/FloatingButton';
import ConfirmModal from '../components/ConfirmModal';
import { useLogout } from '../hooks/useLogout';
import { useDeleteUser } from '../hooks/useDeleteUser';

import { HamburgerButton } from '../components/HamburgerButton';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../hooks/useSidebar';

import searchIcon from '../assets/search-icon.svg';

const RootLayout = () => {
  const { isOpen, toggle, close } = useSidebar();
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
      <header className="header fixed top-0 left-0 bg-white shadow-sm z-50 w-full">
        <div className="header-left flex items-center h-16 gap-4 max-w-7xl px-4 sm:px-6 lg:px-8">
          {!isAuthPage && (
            <HamburgerButton isOpen={isOpen} onClick={toggle} />
          )}

          <Link to="/" className="logo text-xl font-bold text-gray-900">
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

      <Sidebar isOpen={isOpen} onClose={close} />

      {!isAuthPage ? (
        <div className="layout-body min-h-screen bg-gray-50 dark:bg-gray-950 w-full pt-16">
          <main className="main-content">
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="auth-main-content pt-16">
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