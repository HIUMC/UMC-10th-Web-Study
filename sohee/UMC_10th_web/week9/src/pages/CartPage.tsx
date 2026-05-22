import { useEffect } from 'react';
import { Modal } from '../components/Modal';
import { CartItem } from '../constants/cartItems';
import { usePlaylistStore } from '../store/usePlaylistStore';

function CartRow({ item }: { item: CartItem }) {
  const { decrease, increase, removeItem } = usePlaylistStore();

  return (
    <article className="grid grid-cols-[126px_1fr_166px] items-center gap-[26px] border-b border-slate-200 px-[26px] py-[26px] max-[900px]:grid-cols-[80px_1fr_104px] max-[900px]:gap-4 max-[900px]:px-5 max-[900px]:py-4">
      <img className="h-[126px] w-[126px] rounded object-cover max-[900px]:h-20 max-[900px]:w-20" src={item.img} alt={item.title} />

      <div className="min-w-0">
        <h2 className="truncate text-[31px] font-extrabold leading-tight text-black max-[900px]:text-xl">
          {item.title}
        </h2>
        <p className="mt-1 truncate text-[24px] font-medium leading-tight text-slate-500 max-[900px]:text-sm">
          {item.singer}
        </p>
        <p className="mt-1 text-[26px] font-extrabold leading-tight text-slate-800 max-[900px]:text-lg">
          ${item.price}
        </p>
      </div>

      <div className="flex items-center justify-self-end overflow-hidden rounded-md bg-slate-300 text-[24px] font-bold text-slate-800 max-[900px]:text-base">
        <button
          className="h-[52px] w-[52px] bg-slate-300 transition hover:bg-slate-400 max-[900px]:h-8 max-[900px]:w-8"
          type="button"
          aria-label={`${item.title} decrease amount`}
          onClick={() => decrease(item.id)}
        >
          -
        </button>
        <span className="flex h-[54px] w-[64px] items-center justify-center border border-slate-300 bg-white font-medium max-[900px]:h-8 max-[900px]:w-10">
          {item.amount}
        </span>
        <button
          className="h-[52px] w-[52px] bg-slate-300 transition hover:bg-slate-400 max-[900px]:h-8 max-[900px]:w-8"
          type="button"
          aria-label={`${item.title} increase amount`}
          onClick={() => increase(item.id)}
        >
          +
        </button>
      </div>

      <button className="sr-only" type="button" onClick={() => removeItem(item.id)}>
        remove item
      </button>
    </article>
  );
}

export default function CartPage() {
  const { cartItems, amount, total, calculateTotals, openModal } = usePlaylistStore();

  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-10 flex h-[106px] items-center justify-between bg-slate-800 px-[22px] text-white max-[900px]:h-16 max-[900px]:px-5">
        <h1 className="text-[50px] font-extrabold tracking-tight max-[900px]:text-3xl">Ohtani Ahn</h1>
        <div className="flex items-center gap-3 text-[36px] font-extrabold max-[900px]:text-2xl">
          <svg className="h-11 w-11 max-[900px]:h-8 max-[900px]:w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2ZM7.16 14.26c-.75 0-1.41-.41-1.75-1.03L1.7 6H0V3h3.5l.94 2h16.7c.75 0 1.23.8.88 1.46l-3.58 6.49c-.35.63-1.01 1.03-1.75 1.03H7.16ZM6.1 7l2 4h7.98l2.2-4H6.1Z" />
          </svg>
          <span>{amount}</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1160px] max-[900px]:max-w-none">
        {cartItems.length > 0 ? (
          <>
            <section aria-label="album cart list">
              {cartItems.map((item) => (
                <CartRow key={item.id} item={item} />
              ))}
            </section>

            <footer className="grid gap-8 py-10 max-[900px]:gap-10">
              <button
                className="justify-self-center rounded border border-black px-6 py-4 text-base font-medium text-black transition hover:bg-slate-900 hover:text-white"
                type="button"
                onClick={openModal}
              >
                {'\uC804\uCCB4 \uC0AD\uC81C'}
              </button>
              <div className="mx-[26px] flex items-center justify-between border-t-2 border-slate-800 pt-6 text-3xl font-extrabold max-[900px]:mx-5 max-[900px]:pt-5 max-[900px]:text-xl">
                <span>{'\uCD1D \uAE08\uC561'}</span>
                <span>${total}</span>
              </div>
            </footer>
          </>
        ) : (
          <section className="grid min-h-[calc(100vh-108px)] place-items-center text-center">
            <div>
              <p className="text-3xl font-bold text-slate-700">{'\uC7A5\uBC14\uAD6C\uB2C8\uAC00 \uBE44\uC5C8\uC2B5\uB2C8\uB2E4.'}</p>
              <p className="mt-3 text-lg text-slate-500">
                {'\uC804\uCCB4 \uC218\uB7C9\uACFC \uCD1D \uAE08\uC561\uC774 0\uC73C\uB85C \uCD08\uAE30\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4.'}
              </p>
            </div>
          </section>
        )}
      </main>
      <Modal />
    </div>
  );
}
