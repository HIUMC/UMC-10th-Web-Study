import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import MyPage from "../pages/MyPage";

const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col">
      <div className="h">
        <Navbar />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
};

export default HomeLayout;
