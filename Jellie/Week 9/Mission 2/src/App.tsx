import { useEffect } from 'react';

import Navbar from './components/Navbar';
import CartList from './components/CartList';
import Footer from './components/Footer';
import Modal from './components/Modal';

import { calculateTotals } from './features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from './hooks/useRedux';

function App() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const isOpen = useAppSelector((state) => state.modal.isOpen);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch, cartItems]);

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