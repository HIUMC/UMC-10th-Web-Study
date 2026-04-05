import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar'; // 경로 확인!

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default HomePage;