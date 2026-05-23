import { useEffect } from "react";
import { useCartStore } from "./stores/useCartStore";
import { useModalStore } from "./stores/useModalStore";

function App() {
  const cartItems = useCartStore((state) => state.cartItems);
  const amount = useCartStore((state) => state.amount);
  const total = useCartStore((state) => state.total);
  const increase = useCartStore((state) => state.increase);
  const decrease = useCartStore((state) => state.decrease);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const calculateTotals = useCartStore((state) => state.calculateTotals);

  const isOpen = useModalStore((state) => state.isOpen);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  const handleConfirmClearCart = () => {
    clearCart();
    closeModal();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="rounded-lg bg-white px-8 py-7 text-center shadow-2xl">
            <h2 className="mb-6 text-xl font-bold">
              정말 삭제하시겠습니까?
            </h2>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md bg-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-300"
              >
                아니요
              </button>

              <button
                type="button"
                onClick={handleConfirmClearCart}
                className="rounded-md bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600"
              >
                네
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-slate-800 px-8 py-5 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-2xl font-bold">Masha's Market</h1>

          <div className="flex items-center gap-2 text-xl font-bold">
            🛒
            <span>{amount}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl bg-white px-8 py-6">
        {cartItems.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-3xl font-bold">장바구니가 비었습니다.</h2>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-5"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-20 w-20 rounded-md object-cover"
                  />

                  <div>
                    <h2 className="text-lg font-bold">{item.title}</h2>
                    <p className="text-sm text-gray-500">{item.singer}</p>
                    <p className="font-bold text-slate-700">${item.price}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => decrease(item.id)}
                    className="h-9 w-9 rounded-l-md bg-slate-300 text-lg font-bold hover:bg-slate-400"
                  >
                    -
                  </button>

                  <span className="flex h-9 w-12 items-center justify-center border-y border-slate-300 bg-white text-lg">
                    {item.amount}
                  </span>

                  <button
                    type="button"
                    onClick={() => increase(item.id)}
                    className="h-9 w-9 rounded-r-md bg-slate-300 text-lg font-bold hover:bg-slate-400"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="ml-4 text-sm text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="mt-8 border-t border-gray-300 pt-6">
          <div className="mb-6 flex items-center justify-between text-2xl font-bold">
            <span>총 금액</span>
            <span>${total}</span>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={openModal}
              disabled={cartItems.length === 0}
              className="rounded-md border border-black px-8 py-4 text-lg font-bold hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white"
            >
              전체 삭제
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;