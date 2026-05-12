import { Outlet } from "react-router-dom";
import { NavBar } from "../components/Navbar";

const HomePage = () => {
  return (
    <>
      <div>
        <NavBar />
        <Outlet />
      </div>
    </>
  );
};
export default HomePage;
