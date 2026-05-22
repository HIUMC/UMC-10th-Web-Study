import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';
import { closeModal } from '../features/modal/modalSlice';
import { AppDispatch, RootState } from '../store';

export function Modal() {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-5">
      <section
        className="w-full max-w-md rounded bg-white px-8 py-7 text-center shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-cart-modal-title"
      >
        <h2 id="clear-cart-modal-title" className="text-2xl font-bold text-slate-900">
          {'\uC7A5\uBC14\uAD6C\uB2C8\uB97C \uBE44\uC6B0\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?'}
        </h2>
        <p className="mt-3 text-slate-500">{'\uC0AD\uC81C\uD55C \uC74C\uBC18 \uBAA9\uB85D\uC740 \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC5B4\uC694.'}</p>
        <div className="mt-7 flex justify-center gap-3">
          <button
            className="rounded border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            type="button"
            onClick={() => dispatch(closeModal())}
          >
            {'\uC544\uB2C8\uC694'}
          </button>
          <button
            className="rounded bg-slate-800 px-6 py-3 font-semibold text-white transition hover:bg-slate-950"
            type="button"
            onClick={handleConfirm}
          >
            {'\uB124'}
          </button>
        </div>
      </section>
    </div>
  );
}
