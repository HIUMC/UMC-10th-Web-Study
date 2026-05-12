import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { FloatingActionButton } from './FloatingActionButton';
import { useAuth } from '../hooks/useAuth';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const auth = useAuth();

  return (
    <div className="app-shell">
      <Header
        user={auth.user}
        onBurgerClick={() => setSidebarOpen((prev) => !prev)}
        onLogout={auth.logout}
      />
      <div className="app-content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={auth.user} />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
      <FloatingActionButton to="/create" />
    </div>
  );
}
