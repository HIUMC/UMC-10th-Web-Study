import { useEffect } from 'react';

import Navbar from './components/Navbar';
import CartList from './components/CartList';
import Footer from './components/Footer';
import Modal from './components/Modal';

import { useCartStore } from './store/useCartStore';

function App() {
  const cartItems = useCartStore(
    (state) => state.cartItems
  );

  const isOpen = useCartStore(
    (state) => state.isOpen
  );

  const calculateTotals = useCartStore(
    (state) => state.calculateTotals
  );

  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <CartList />
        <Footer />
      </main>

      {isOpen && <Modal />}
    </div>
  );
}

export default App;