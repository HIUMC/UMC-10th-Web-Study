import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function HomeLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#111",
      }}
    >
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            paddingTop: "5rem",
            position: "relative",
            background: "#111",
          }}
        >
          <Outlet />
          {/* ✅ + 버튼은 LpListPage에서만 렌더링하므로 여기서 제거 */}
        </main>
      </div>
    </div>
  );
}