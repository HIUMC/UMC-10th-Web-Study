import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.tsx"; 

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