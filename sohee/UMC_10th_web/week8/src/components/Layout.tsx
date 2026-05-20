import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { FloatingActionButton } from './FloatingActionButton';
import { LpPostModal } from './LpPostModal';
import { useAuth } from '../hooks/useAuth';

function fakeAuthRequest() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, 200);
  });
}

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: fakeAuthRequest,
    onSuccess: () => {
      auth.logout();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: fakeAuthRequest,
    onSuccess: () => {
      auth.withdraw();
      queryClient.clear();
      setWithdrawModalOpen(false);
      setSidebarOpen(false);
      navigate('/login', { replace: true });
    },
  });

  const openCreateModal = () => {
    if (!auth.user) {
      navigate('/login', { state: { from: '/v1/lps' } });
      return;
    }
    setCreateModalOpen(true);
  };

  return (
    <div className="app-shell">
      <Header
        user={auth.user}
        onBurgerClick={() => setSidebarOpen((prev) => !prev)}
        onLogout={() => logoutMutation.mutate()}
        isLoggingOut={logoutMutation.isPending}
      />
      <div className="app-content">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={auth.user}
          onWithdraw={() => setWithdrawModalOpen(true)}
          isWithdrawing={withdrawMutation.isPending}
        />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
      <FloatingActionButton onClick={openCreateModal} />
      {auth.user && (
        <LpPostModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} user={auth.user} />
      )}

      {withdrawModalOpen && (
        <div className="modal-backdrop" onMouseDown={() => setWithdrawModalOpen(false)}>
          <section
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdraw-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="withdraw-title">정말 탈퇴하시겠어요?</h2>
            <p>계정 정보가 삭제되고 로그인 페이지로 이동합니다.</p>
            <div className="confirm-actions">
              <button type="button" className="ghost-button" onClick={() => setWithdrawModalOpen(false)}>
                아니오
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={() => withdrawMutation.mutate()}
                disabled={withdrawMutation.isPending}
              >
                예
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
