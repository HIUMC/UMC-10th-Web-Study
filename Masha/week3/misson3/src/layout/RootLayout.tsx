import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar"; // 수민 님의 Navbar 경로

export const RootLayout = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
};