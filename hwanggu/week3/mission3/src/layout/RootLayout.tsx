import { Outlet } from "react-router-dom";
import { NavBar } from "@/components/NavBar";

export const RootLayout = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-black">
      <NavBar />
      <Outlet />
    </div>
  );
};