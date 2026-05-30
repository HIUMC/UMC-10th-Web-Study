import { useEffect } from 'react';
import { useCartStore } from './store/useCartStore';
import Navbar from './components/Navbar'; // 본인의 Navbar 경로에 맞게 수정하세요
import CartContainer from './components/CartContainer';
import Footer from './components/Footer';
import Modal from './components/Modal';

export default function App() {
  const { isOpen, calculateTotals } = useCartStore();

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  return (
    <main className="min-h-screen bg-[#0f1a0f] pb-24">
      {isOpen && <Modal />}
      <Navbar />
      <CartContainer />
      <Footer />
    </main>
  );
}