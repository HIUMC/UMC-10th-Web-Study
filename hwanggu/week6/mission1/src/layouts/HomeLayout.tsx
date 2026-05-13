import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar"; // Header 대신 Navbar 사용
import Sidebar from "../components/Sidebar.tsx";

export default function HomeLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // 추가

  return (
<div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#111' }}>
  <Navbar onMenuClick={() => setSidebarOpen(true)} />
  <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    <main style={{ flex: 1, overflowY: 'auto', padding: '1rem', paddingTop: '5rem', position: 'relative', background: '#111' }}>
      <Outlet />
      <button
        onClick={() => navigate('/lp/new')}
        style={{
          position: 'fixed', bottom: 32, right: 32,
          width: 56, height: 56, borderRadius: '50%',
          fontSize: 28, background: '#8B5CF6', color: '#fff', border: 'none', cursor: 'pointer'
        }}
      >+</button>
    </main>
  </div>
</div>
  );
}
