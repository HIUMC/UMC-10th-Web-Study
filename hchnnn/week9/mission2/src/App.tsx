import Navbar from './components/Navbar';
import CartContainer from './components/CartContainer';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#111d11] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <CartContainer />
      </main>
      <Footer />
    </div>
  );
}