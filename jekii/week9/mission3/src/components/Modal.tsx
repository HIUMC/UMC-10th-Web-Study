import { useCartStore } from "../hooks/useCartStore";

const Modal = () => {
  const {
    isOpen,
    actions: { clearCart, closeModal },
  } = useCartStore();

  if (!isOpen) {
    return null;
  }

  const handleCancel = (): void => {
    closeModal();
  };

  const handleConfirm = (): void => {
    clearCart();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="rounded-md bg-white p-6 text-center shadow-lg">
        <p className="mb-5 font-semibold text-slate-900">
          정말 삭제하시겠습니까?
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={handleCancel}
            className="rounded-md bg-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-300"
          >
            아니요
          </button>
          <button
            onClick={handleConfirm}
            className="rounded-md bg-rose-500 px-4 py-2 text-white hover:bg-rose-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
