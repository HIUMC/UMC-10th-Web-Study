import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../hooks/useSidebar";

export default function HomeLayout() {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#111" }}>
      {/* ✅ toggle로 변경 - 클릭마다 열리고 닫힘 */}
      <Navbar onMenuClick={toggle} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar isOpen={isOpen} onClose={close} />
        <main style={{ flex: 1, overflowY: "auto", padding: "1rem", paddingTop: "5rem", position: "relative", background: "#111" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}