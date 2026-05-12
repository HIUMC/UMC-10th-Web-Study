import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 dark:bg-[#121212] text-slate-800 dark:text-white font-sans relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200 dark:bg-[#2a2a32] rounded-full opacity-40 dark:opacity-20 blur-3xl transition-colors pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-200 dark:bg-pink-900 rounded-full opacity-40 dark:opacity-20 blur-3xl transition-colors pointer-events-none"></div>

      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex overflow-hidden relative z-10">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className="flex-1 overflow-y-auto relative w-full">
          <div className="p-6 min-h-full">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
