import { Outlet } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] text-white">
      <AppNavbar />
      <main className="mx-auto max-w-7xl px-5 pb-16 pt-8 md:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default HomePage;
