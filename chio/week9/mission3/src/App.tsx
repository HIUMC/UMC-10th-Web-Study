import { useEffect } from 'react';
import { useCartStore } from './features/cart/cartStore';
import Navbar from './components/Navbar';
import CartContainer from './components/CartContainer';
import Modal from './components/Modal';

function App() {
  const cartItems = useCartStore((state) => state.cartItems);
  const calculateTotals = useCartStore((state) => state.calculateTotals);

  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col bg-white max-w-2xl w-full mx-auto shadow-sm border-x border-slate-200">
        <CartContainer />
      </main>
      <Modal />
    </div>
  );
}

export default App;
