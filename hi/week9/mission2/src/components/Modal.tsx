import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../app/store';
import { clearCart } from '../features/cart/cartSlice';
import { closeModal } from '../features/modal/modalSlice';

const Modal = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[90%] max-w-md rounded-lg bg-white px-8 py-7 text-center shadow-xl">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          정말 장바구니를 비우시겠습니까?
        </h2>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="rounded-md border border-gray-400 px-5 py-2 text-gray-700 hover:bg-gray-100"
          >
            아니요
          </button>

          <button
            type="button"
            onClick={handleClearCart}
            className="rounded-md border border-red-500 px-5 py-2 text-red-500 hover:bg-red-500 hover:text-white"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;