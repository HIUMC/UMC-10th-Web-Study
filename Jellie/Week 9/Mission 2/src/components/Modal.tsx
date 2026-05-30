import { clearCart } from '../features/cart/cartSlice';
import { closeModal } from '../features/modal/modalSlice';
import { useAppDispatch } from '../hooks/useRedux';

function Modal() {
  const dispatch = useAppDispatch();

  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[400px] rounded-md bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-center text-xl font-bold">
          장바구니를 비우시겠습니까?
        </h2>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleCancel}
            className="rounded border px-4 py-2 hover:bg-gray-100"
          >
            아니오
          </button>

          <button
            onClick={handleConfirm}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;