import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { FloatingActionButton } from './FloatingActionButton';
import { LpPostModal } from './LpPostModal';
import { useAuth } from '../hooks/useAuth';
import { useSidebar } from '../hooks/useSidebar';

function fakeAuthRequest() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, 200);
  });
}

export function Layout() {
  const sidebar = useSidebar();
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
      sidebar.close();
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
        isSidebarOpen={sidebar.isOpen}
        onBurgerClick={sidebar.toggle}
        onLogout={() => logoutMutation.mutate()}
        isLoggingOut={logoutMutation.isPending}
      />
      <div className="app-content">
        <Sidebar
          isOpen={sidebar.isOpen}
          onClose={sidebar.close}
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
            <h2 id="withdraw-title">Withdraw account?</h2>
            <p>Your account information will be removed and you will move to the login page.</p>
            <div className="confirm-actions">
              <button type="button" className="ghost-button" onClick={() => setWithdrawModalOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={() => withdrawMutation.mutate()}
                disabled={withdrawMutation.isPending}
              >
                Confirm
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
