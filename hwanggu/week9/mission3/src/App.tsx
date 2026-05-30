import { useCartStore } from './store/useCartStore';
import Navbar from './components/Navbar';
import CartContainer from './components/CartContainer';
import Footer from './components/Footer';
import Modal from './components/Modal';

export default function App() {
  const isOpen = useCartStore((state) => state.isOpen);

  return (
    <div className="min-h-screen bg-[#0f1f0f] flex flex-col">
      {isOpen && <Modal />}
      <Navbar />
      <main className="flex-1">
        <CartContainer />
      </main>
      <Footer />
    </div>
  );
}
