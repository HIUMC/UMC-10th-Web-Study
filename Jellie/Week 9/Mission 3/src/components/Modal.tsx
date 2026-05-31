import { useCartStore } from '../store/useCartStore';

function Modal() {
  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const closeModal = useCartStore(
    (state) => state.closeModal
  );

  const handleYes = () => {
    clearCart();
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="rounded bg-white p-6">
        <h2>장바구니를 비우시겠습니까?</h2>

        <div className="mt-4 flex gap-3">
          <button onClick={closeModal}>
            아니오
          </button>

          <button onClick={handleYes}>
            네
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;