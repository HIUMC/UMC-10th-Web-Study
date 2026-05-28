import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './app/store';
import CartItem from './components/CartItem';
import Modal from './components/Modal';
import Navbar from './components/Navbar';
import { calculateTotals } from './features/cart/cartSlice';
import { openModal } from './features/modal/modalSlice';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { cartItems, total } = useSelector((state: RootState) => state.cart);
  const { isOpen } = useSelector((state: RootState) => state.modal);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {isOpen && <Modal />}

      <main className="mx-auto max-w-4xl px-6 py-8">
        {cartItems.length === 0 ? (
          <section className="flex flex-col items-center justify-center py-24">
            <h2 className="text-3xl font-bold text-gray-700">
              장바구니가 비어 있습니다.
            </h2>
          </section>
        ) : (
          <>
            <section>
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </section>

            <footer className="mt-10 flex flex-col items-center gap-6 border-t border-gray-200 pt-6">
              <div className="flex w-full justify-between text-2xl font-bold">
                <span>총 금액</span>
                <span>${total.toLocaleString()}</span>
              </div>

              <button
                type="button"
                onClick={() => dispatch(openModal())}
                className="rounded border border-black px-6 py-3 text-lg hover:bg-black hover:text-white"
              >
                전체 삭제
              </button>
            </footer>
          </>
        )}
      </main>
    </div>
  );
};

export default App;